const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

        // Gell All Courses

        app.get('/alluser', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {}
            const cursor = userCollection.find(query)
            const userData = await cursor.skip(page * size).limit(size).toArray();
            const count = await userCollection.estimatedDocumentCount();
            res.send({ count, userData })
        })

        // admin
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
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

