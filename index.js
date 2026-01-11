// ==================Recommended Order=================
// 1. Required by common js (express, cors, etc.)
// 2 .App Initialization (const app = express())
// 3. Middleware Setup (cors, json, logging)
// 4. Database Configuration & Connection (MongoDB client setup and run() function)
// 5. Routes
// 6. Server Startup (app.listen)
// simple-crud
// KdPFhFNtgrMKubiG
// =======================================================

// === 1. required ===
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// === 2. instance initialization ===
const app = express();
const port = process.env.PORT || 5000;

// === 3. middleware setup ====
app.use(express.json());
app.use(cors());

// === 4. mongodb setup ===
const uri =
  "mongodb+srv://simple-crud:KdPFhFNtgrMKubiG@cluster0.89rnkti.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const myDb = client.db("studentDb");
    const myColl = myDb.collection("students");
    
    // ====received data from client side=========
    // === send data to mongodb ==============
    // =======by these methods ============

    // get() method
    app.get("/users", async (req, res) => {
      const myCursor = myColl.find();
      const result = await myCursor.toArray();
      res.send(result);
    });

    // get() method
    app.get("/users/:id", async (req, res) => {
      const myId = req.params.id;
      const myQuery = { _id: new ObjectId(myId) };
      const result = await myColl.findOne(myQuery);
      res.send(result);
    });

    // post() method
    app.post("/users", async (req, res) => {
      const myDoc = req.body;
      const result = await myColl.insertOne(myDoc);
      res.send(result);
    });

    // put() method
    app.put("/users/:id", async (req, res) => {
      const myId = req.params.id;
      const myUser = req.body;
      console.log(myId, myUser);
      const myQuery = { _id: new ObjectId(myId) };
      const myUpdate = {
        $set: {
          name: myUser.name,
          email: myUser.email,
        },
      };
      const myOptions = {
        upsert: true,
      };
      const result = await myColl.updateOne(myQuery, myUpdate, myOptions);
      res.send(result);
    });

    // delete() method
    app.delete("/users/:id", async (req, res) => {
      const myId = req.params.id;
      const myQuery = { _id: new ObjectId(myId) };
      const result = await myColl.deleteOne(myQuery);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log(error);
  }
}
run();

// === 5.routes setup ===
// ====received data from client side====
app.get("/", (req, res) => {
  res.send("the server is working");
});

// === 6. server startup ===
app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
