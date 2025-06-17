const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const admin = require("firebase-admin");

const decoded = Buffer.from(process.env.TOKEN_KEY, 'base64').toString('utf8');
const serviceAccount = JSON.parse(decoded);

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

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const verifyToken = async (request, response, next) => {
    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(401).send({ message: 'Unauthorized Access' })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        console.log(decoded)
        request.decoded = decoded;
        next();
    }
    catch (error) {
        return response.status(401).send({ message: 'Unauthorized Access' })
    }
}

const verifyTokenByEmail = async (request, response, next) => {
    if (request.query.email !== request.decoded.email) {
        return response.status(403).send({ message: 'Forbidden Access' })
    }

    next();
}

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // DATABASE CONNECTION
        const tourPackagesCollection = client.db("MuqaddasDB").collection("tourPackages");
        const bookingsCollection = client.db("MuqaddasDB").collection("bookings");

        // POSTING AN AD OF PACKAGE
        app.post("/packages", verifyToken, async (request, response) => {
            const newTourPackage = request.body;
            const result = await tourPackagesCollection.insertOne(newTourPackage);

            response.send(result);
        });

        // TO GET ALL THE PACKAGES && ALSO SPECIFIC PACKAGE USING EMAIL && SEARCH FUNCTIONALITY
        app.get("/packages", async (request, response) => {
            const email = request.query.email;
            const search = request.query.search;
            const query = {};

            if (search) {
                query.tour_name = { $regex: search, $options: "i" };
            }

            if (email) {
                const authHeader = request.headers?.authorization;

                if (!authHeader || !authHeader.startsWith("Bearer ")) {
                    return response.status(401).send({ message: "Unauthorized Access" });
                }

                const token = authHeader.split(" ")[1];

                try {
                    const decoded = await admin.auth().verifyIdToken(token);
                    request.decoded = decoded;
                }
                catch {
                    return response.status(401).send({ message: "Unauthorized Access" })
                }
            }

            if (email) {
                query.guide_email = email;
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
        app.put("/package/:id", verifyToken, async (request, response) => {
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

        // SAVING THE COUNTER OF BOOK NOW BUTTON
        app.patch("/package/:id", async (request, response) => {
            const id = request.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $inc: { booking_count: 1 }
            };
            const options = {
                returnDocument: "after"
            };
            const result = await tourPackagesCollection.findOneAndUpdate(
                filter,
                updateDoc,
                options
            );

            response.send(result.value);
        })

        // TO DELETE PACKAGE DETAILS
        app.delete("/package/:id", verifyToken, async (request, response) => {
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
        app.get("/bookings", verifyToken, verifyTokenByEmail, async (request, response) => {
            const email = request.query.email;
            const query = {};

            if (email) {
                query.buyer_email = email;
            }

            const result = await bookingsCollection.find(query).toArray();

            for (const booking of result) {
                const tour_id = booking.tour_id;
                const tourQuery = { _id: new ObjectId(tour_id) };
                const tour = await tourPackagesCollection.findOne(tourQuery);

                booking.image = tour.image;
                booking.destination = tour.destination;
                booking.departure_location = tour.departure_location;
                booking.departure_date = tour.departure_date;
                booking.guide_name = tour.guide_name;
                booking.guide_contact_no = tour.guide_contact_no;
                booking.guide_email = tour.guide_email;
            }

            response.send(result);
        })

        // TO UPDATE BOOKING STATUS
        app.patch("/booking/:id", async (request, response) => {
            const id = request.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const updatedBooking = request.body;
            const updatedDoc = {
                $set: {
                    status: updatedBooking.status
                }
            }

            const result = await bookingsCollection.updateOne(filter, updatedDoc, options);
            response.send(result);
        })

        // FOR LIMIT OPERATOR
        app.get("/close-packages", async (request, response) => {
            const today = new Date();

            const result = await tourPackagesCollection
                .aggregate([
                    {
                        $addFields: {
                            departureDate: { $toDate: "$departure_date" }
                        }
                    },
                    {
                        $match: {
                            departureDate: { $gte: today }
                        }
                    },
                    {
                        $sort: { departureDate: 1 }
                    },
                    {
                        $limit: 6
                    }
                ])
                .toArray();

            response.send(result);
        });


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