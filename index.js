const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // POSTING AN AD OF PACKAGE
        app.post("/packages", async (request, response) => {
            const newTourPackage = request.body;
            const result = await tourPackagesCollection.insertOne(newTourPackage);

            response.send(result);
        });

        // TO GET ALL THE PACKAGES && ALSO SPECIFIC PACKAGE USING EMAIL && SEARCH FUNCTIONALITY
        app.get("/packages", async (request, response) => {
            const email = request.query.email;
            const search = request.query.search;
            const query = {};

            if (email) {
                query.guide_email = email;
            }

            if(search){
                query.tour_name = { $regex: search, $options: "i" };
            }

            const result = await tourPackagesCollection.find(query).toArray();

            response.send(result);
        })

        // TO GET SPECIFIC PACKAGE USING ID
        app.get("/package/:id", async (request, response) => {
            const id = request.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tourPackagesCollection.findOne(query);

            response.send(result);
        });

        // TO UPDATE PACKAGE DETAILS
        app.put("/package/:id", async (request, response) => {
            const id = request.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const updatedPackage = request.body;
            const updatedDoc = {
                $set: updatedPackage
            }

            const result = await tourPackagesCollection.updateOne(filter, updatedDoc, options);
            response.send(result);
        })

        // TO DELETE PACKAGE DETAILS
        app.delete("/package/:id", async (request, response) => {
            const id = request.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await tourPackagesCollection.deleteOne(query);

            response.send(result);
        })

        // POSTING AN AD OF BOOKING
        app.post("/bookings", async (request, response) => {
            const newBooking = request.body;
            const result = await bookingsCollection.insertOne(newBooking);

            response.send(result);
        });

        // TO GET ALL THE BOOKINGS && ALSO SPECIFIC BOOKINGS USING EMAIL
        app.get("/bookings", async (request, response) => {
            const email = request.query.email;
            const query = {};

            if (email) {
                query.guide_email = email;
            }

            const result = await bookingsCollection.find(query).toArray();

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