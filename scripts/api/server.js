import {
  validateNonEmpty,
  validateURL,
  validateDates,
} from "../utils/validate_helpers.js";

import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import express from "express";
import cors from "cors";
const app = express();
const port = 3000;

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

app.get("/destinations", cors(options), (req, res) => {
  collection
    .find()
    .toArray()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/destinations", cors(options), (req, res, next) => {
  if (
    validateNonEmpty(req.body.country) &&
    validateDates(req.body.dateStart, req.body.dateEnd) &&
    validateNonEmpty(req.body.name) &&
    validateURL(req.body.link)
  ) {
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
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      })
      .finally(() => {
        next();
      });
  } else {
    res.status(400).send("Bad request");
  }
});

app.listen(port, () => {
  console.log(`Server init at: localhost:${port}`);
});
