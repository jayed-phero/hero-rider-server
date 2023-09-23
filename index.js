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


async function run() {
    try {
        const lecturerCollection = client.db('QuranicLife').collection('islamicPodcast')
        const poscastCollection = client.db('QuranicLife').collection('lectures')
        const masyalaCollection = client.db('QuranicLife').collection('masyalas')


        app.post("/lectures", async (req, res) => {
            const lectureInfo = req.body;

            const existingLecture = await poscastCollection.findOne({ title: lectureInfo.itemId });

            if (existingLecture) {
                return res.status(400).json({ error: 'Lecture with the same title already exists' });
            } else {
                const result = await poscastCollection.insertOne(lectureInfo);
                return res.status(201).json(result.ops[0]);
            }
        });

        app.get("/lecturers", async (req, res) => {
            try {
                const lecturers = await lecturerCollection.find().toArray();
                const lecturersWithCounts = [];
                for (const lecturer of lecturers) {
                    const lecturerId = lecturer.lecturerId;
                    const lectureCount = await poscastCollection.countDocuments({ lecturerId });

                    lecturersWithCounts.push({
                        lecturerId: lecturer.lecturerId,
                        name: lecturer.name,
                        image: lecturer.image,
                        lectureCount: lectureCount,
                    });
                }
                res.json(lecturersWithCounts);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });


        app.get("/lectures/:lecturerId", async (req, res) => {
            const lecturerId = req.params.lecturerId;

            try {
                const lectures = await poscastCollection.find({ lecturerId }).toArray();
                res.json(lectures);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        app.post("/masyalas", async (req, res) => {
            const masyalaInfo = req.body;

            const existingMasyala = await masyalaCollection.findOne({ title: masyalaInfo.masyalaId });

            if (existingMasyala) {
                return res.status(400).json({ error: 'Lecture with the same title already exists' });
            } else {
                const result = await masyalaCollection.insertOne(lectureInfo);
                return res.status(201).json(result.ops[0]);
            }
        });

        app.get("/masyalas", async (req, res) => {
            try {
                const masyalas = await masyalaCollection.find().toArray();
                res.json(masyalas);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        app.get("/masyalas/:lecturerId", async (req, res) => {
            const lecturerId = req.params.lecturerId;

            try {
                const lectures = await masyalaCollection.find({ lecturerId }).toArray();
                res.json(lectures);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });


    }
    finally {

    }

}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Quranic Life Site is Running')
})

app.listen(port, () => {
    console.log(`Quranic Life server is Running on port ${port}`)
})


// echo "# hero-rider-server" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/jayed-phero/hero-rider-server.git
// git push -u origin main

