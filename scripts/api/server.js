const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

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
const options = {
  origin: ["http://127.0.0.1:5500/add.html", "http://127.0.0.1:5500"],
  methods: ["GET", "POST"],
  allowedHeaders: ["X-Requested-With,content-type"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/destinations", cors(options), async (req, res, next) => {
  const result = await collection.find().toArray();
  res.status(200).send(result);
  next();
});

app.post("/destinations", cors(options), async (req, res, next) => {
  collection
    .insertOne({
      name: req.body.name,
      country: req.body.country,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      description: req.body.description,
      link: req.body.link,
      image: req.body.image,
    })
    .then((response) => {
      const resID = new ObjectId(response.insertedId);
      console.log(resID);
      res.status(201).json({ insertedID: resID });
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
      next();
    });
});

app.listen(port, () => {
  console.log(`Server init at: localhost:${port}`);
});
