const express = require("express");
const app = express();
const port = 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("travelJournal");
const collection = db.collection("destinations");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const result = await collection.find().toArray();
  console.log(result);
  res.status(200).send("INIT");
});

app.post("/add", (req, res) => {
  collection.insertOne({
    name: req.body.name,
    country: req.body.country,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    description: req.body.description,
    link: req.body.link,
    image: req.body.image,
  });
  //   console.log(req.body);
  res.status(201).send("Added travel destination");
});

app.listen(port, () => {
  console.log(`Server init at: localhost:${port}`);
});

// Destination schema
// ObjectId
// name*
// country*
// dateStart
// dateEnd
// description
// link - maybe automated
// image
