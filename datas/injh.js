const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config()


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 5000
const origin = 'http://localhost:3000'
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

// app.use(cors(corsOptions));
app.use(cors(origin));



// app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.msatzvk.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const lecturerCollection = client.db('QuranicLife').collection('islamicPodcast')
        const poscastCollection = client.db('QuranicLife').collection('lectures')
        const masyalaCollection = client.db('QuranicLife').collection('masyalas')
        const testCollection = client.db('QuranicLife').collection('Test')



        // // WebSocket connection
        // io.on('connection', (socket) => {
        //     console.log('A user connected');

        //     // Disconnect event
        //     socket.on('disconnect', () => {
        //         console.log('User disconnected');
        //     });
        // });

        const changeStream = testCollection.watch();

        changeStream.on('change', (change) => {
            console.log('Change:', change);

            if (change.operationType == 'insert') {
                console.log('insert')
            }
            // Send notification to connected clients (Flutter apps)
            io.emit('newData', { message: 'New data available!', link: 'your-link-to-new-data' });
        });


        io.on('connection', (socket) => {
            console.log('A user connected');

            // Disconnect event
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });

            // Example: Emit an event to the connected client
            socket.emit('welcome', 'Welcome to the server!');
        });


        app.post("/lectures", async (req, res) => {
            const lectureInfo = req.body;

            const existingLecture = await poscastCollection.findOne({ title: lectureInfo.itemId });

            if (existingLecture) {
                return res.status(400).json({ error: 'Lecture with the same title already exists' });
            } else {
                const result = await poscastCollection.insertOne(lectureInfo);
                return res.json({
                    result: result,
                    status: "success"
                });
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
                const lectures = await poscastCollection.find({ lecturerId }).sort({ $natural: -1 }).toArray();
                res.json(lectures);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });



        app.post("/masyalas", async (req, res) => {
            const masyalaInfo = req.body;

            const existingMasyala = await masyalaCollection.findOne({ videoId: masyalaInfo.videoId });

            if (existingMasyala) {
                return res.status(400).json({ error: 'Lecture with the same title already exists' });
            } else {
                const result = await masyalaCollection.insertOne(masyalaInfo);
                // Notify connected clients (Flutter apps) about the new data
                io.emit('newData', { message: 'New masyala available!', link: 'your-link-to-new-masyala' });
                console.log(masyalaInfo)

                return res.json({
                    result,
                    status: "success"
                });
            }
        });


        app.post("/test", async (req, res) => {
            const masyalaInfo = req.body;
            const result = await testCollection.insertOne(masyalaInfo);
            // Notify connected clients (Flutter apps) about the new data
            io.emit('newData', { message: 'New masyala available!', link: 'your-link-to-new-masyala' });
            console.log(masyalaInfo)

            return res.json({
                result,
                status: "success"
            });
        });

        app.get("/masyalas", async (req, res) => {
            try {
                const masyalas = await masyalaCollection.find().sort({ $natural: -1 }).toArray();
                res.json({
                    masyalas,
                    status: "success"
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        app.get("/masyalas/:lecturerId", async (req, res) => {
            const lecturerId = req.params.lecturerId;

            try {
                const lectures = await masyalaCollection.find({ lecturerId }).sort({ $natural: -1 }).toArray();
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

// app.listen(port, () => {
//     console.log(`Quranic Life server is Running on port ${port}`)
// })

server.listen(port, () => {
    console.log(`Quranic Life server is running on port ${port}`);
});


// echo "# hero-rider-server" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/jayed-phero/hero-rider-server.git
// git push -u origin main

