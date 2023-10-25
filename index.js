const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://nazmulofficial:t2jHByZno5Fj2MbG@cluster0.hkrezye.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // await client.connect();

        const userCollection = client.db("VolunteersHUB").collection("user");
        const blogCollection = client.db("VolunteersHUB").collection("blog");
        const eventCollection = client.db("VolunteersHUB").collection("event");
        const contactCollection = client.db("VolunteersHUB").collection("contact");

        app.get('/blog', async (req, res) => {
            const cursor = blogCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/event', async (req, res) => {
            const cursor = eventCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // set user login data to database
        app.post('/user', async (req, res) => {
            const doc = req.body;
            const result = await userCollection.insertOne(doc);
            res.send(result);
        });

        app.post('/blog', async (req, res) => {
            const blog = req.body;
            const result = await blogCollection.insertOne(blog);
            res.send(result);
        });

        app.post('/event', async (req, res) => {
            const event = req.body;
            const result = await eventCollection.insertOne(event);
            res.send(result);
        });

        app.post('/contact', async (req, res) => {
            const contact = req.body;
            const result = await contactCollection.insertOne(contact);
            res.send(result);
        });

        // update user data to database
        app.put('/user', async (req, res) => {
            const user = req.body;
            const filter = { name: user.displayName };
            const options = { upsert: true };
            const updateDoc = {
                $set: { creationTime: user.creationTime, lastSignInTime: user.lastSignInTime, position: user.position }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        });

        app.patch('/blog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const replacement = {
                $set: { states: "Published" }
            };
            const result = await blogCollection.updateOne(query, replacement);
            res.send(result);
        });

        app.patch('/event/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const replacement = {
                $set: { states: "Published" }
            };
            const result = await eventCollection.updateOne(query, replacement);
            res.send(result)
        });

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('Volunteers HUB server is running')
});

app.listen(port, () => console.log('Volunteers HUB server is running on PORT:', port));