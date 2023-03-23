const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.msatzvk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send('unauthorized access')
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        red.decoded = decoded;
        next()
    })
}


async function run() {
    try {
        const userCollection = client.db('HeroRider').collection('users')
        const courseCollection = client.db('HeroRider').collection('Courses')
        const paymentsCollection = client.db('HeroRider').collection('PaymentsInfo')




        app.put('/users/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }

            const result = await userCollection.updateOne(filter, updateDoc, options)

            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '7d'
            })
            console.log(token)
            res.send({
                status: 'success',
                result,
                token
            })
        })


        // get single user
        app.get('/singleuser/:email', async (req, res) => {
            const email = req.params.email
            console.log(email)
            const query = {
                email: email
            }
            const result = await userCollection.findOne(query)
            res.send(result)
        })


        // all course
        app.get('/courses', async (req, res) => {
            const result = await courseCollection.find().toArray()
            res.send(result)
        })


        app.get('/enrolling/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await courseCollection.findOne(query)
            res.send(result)
        })


        // get al user 
        app.get('/alluser', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const search = req.query.search;
            const from = req.query.from ? parseInt(req.query.from) : null;
            const till = req.query.till ? parseInt(req.query.till) : null;
            let query = {};
        
            if (search && search.length) {
                query = {
                    $text: {
                        $search: search
                    }
                }
            }
        
            if (from && till) {
                query.age = {
                    $gte: from,
                    $lte: till
                }
            }
        
            const cursor = userCollection.find(query);
            const userData = await cursor.skip(page * size).limit(size).toArray();
            const count = await userCollection.countDocuments(query);
            res.send({ count, userData });
        });
        

        // app.put('/api/update', async (req, res) => {
        //     try {
        //       const { ids, action } = req.body;
        //       await MyModel.updateMany({ _id: { $in: ids } }, { action });
        //       res.json({ success: true });
        //     } catch (error) {
        //       console.error(error);
        //       res.status(500).json({ success: false, message: 'Server error' });
        //     }
        //   });

        // course by paid 
        app.get('/paidstudent/:email', async (req, res) => {
            const email = req.params.email
            const query = {
                email: email
            }
            const result = await paymentsCollection.find(query).toArray()
            res.send(result)
        })

        // admin
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        // payment 

        app.post("/create-payment-intent", async (req, res) => {
            const enrollInfo = req.body;
            const price = enrollInfo.price

            const amount = price * 100
            const paymentIntent = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: amount,
                "payment_method_types": [
                    "card"
                ]
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        })

        // store payment info 
        app.post('/payments', async (req, res) => {
            const payment = req.body
            const newpaymentInfo = {
                ...payment,
                paid: true
            }
            const result = await paymentsCollection.insertOne(newpaymentInfo)
            res.send(result)
        })


        // get payments info 
        app.get('/paymentsinfo', async (req, res) => {
            const result = await paymentsCollection.find().toArray()
            res.send(result)
        })

        // Get search result
        app.get('/search-result', async (req, res) => {
            const query = {}
            const location = req.query.location
            if (location) query.location = location

            console.log(query)
            const cursor = homesCollection.find(query)
            const homes = await cursor.toArray()
            res.send(homes)
        })


    }
    finally {

    }

}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Hero Rider Site is Running')
})

app.listen(port, () => {
    console.log(`Hero Rider server is Running on port ${port}`)
})


// echo "# hero-rider-server" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/jayed-phero/hero-rider-server.git
// git push -u origin main

