const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@cluster.ug926jx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // DATABASE CONNECTION
        const tourPackagesCollection = client.db("MuqaddasDB").collection("tourPackages");
        const bookingsCollection = client.db("MuqaddasDB").collection("bookings");

        // POSTING AN AD OF TOUR PACKAGE
        app.post("/tour-packages", async(request, response) => {
            const newTourPackage = request.body;
            const result = await tourPackagesCollection.insertOne(newTourPackage);

            response.send(result);
        });

        // TO GET ALL THE PACKAGES
        app.get("/tour-packages", async(request, response) => {
            const result = await tourPackagesCollection.find().toArray();

            response.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);

app.get("/", (request, response) => {
    response.send("Muqaddas is running...");
});

app.listen(port, () => {
    console.log(`Muqaddas is running on: ${port}`);
});