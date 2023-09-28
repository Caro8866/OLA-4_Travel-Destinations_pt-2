import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import Destination from "../../schemas/traveldestination.js";
import { validateNonEmpty, validateURL, validateDates } from "../utils/validate_helpers.js";

const app = express();
const port = 3000;

const uri = "mongodb://127.0.0.1:27017";

// connecting to the database
mongoose
  .connect(`${uri}/travelJournal`)
  .then(() => console.log("MongoDB Connected..."))
  .catch((error) => console.log(error));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// cors options
const options = {
  origin: ["http://127.0.0.1:5500/add.html", "http://127.0.0.1:5500"],
  methods: ["GET", "POST"],
  allowedHeaders: ["X-Requested-With,content-type"],
};

// GET destinations
app.get("/destinations", cors(options), (req, res) => {
  Destination.find()
    .then((destinations) => res.json(destinations))
    .catch((err) => res.status(500).json({ error: "Error Fetching Destinations:", err }));
});

// POST a new destination
app.post("/destinations", cors(options), (req) => {
  if (validateNonEmpty(req.body.country) && validateDates(req.body.dateStart, req.body.dateEnd) && validateNonEmpty(req.body.name) && validateURL(req.body.link)) {
    const destination = new Destination({
      name: req.body.name,
      country: req.body.country,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      description: req.body.description,
      link: req.body.link,
      image: req.body.image,
    });

    // saving destination to the database
    destination
      .save()
      .then(() => console.log("Destination Saved!"))
      .catch((err) => console.error("Error Saving Destination:", err));
  }
});

// PUT a destination
app.put("/destinations/:id", cors(options), (req, res) => {
  Destination.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      country: req.body.country,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      description: req.body.description,
      link: req.body.link,
      image: req.body.image,
    },
    { new: true }
  )
    .then((destination) => res.json(destination))
    .catch((err) => res.status(500).json({ error: "Error Updating Destination:", err }));
});

// DELETE a destination
app.delete("/destinations/:id", cors(options), (req, res) => {
  Destination.findByIdAndDelete(req.params.id)
    .then((destination) => res.json(destination))
    .catch((err) => res.status(500).json({ error: "Error Deleting Destination:", err }));
});

app.listen(port, () => {
  console.log(`Server is running at: http:localhost:${port}`);
});

/* 
OLD WAY


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
  if (validateNonEmpty(req.body.country) && validateDates(req.body.dateStart, req.body.dateEnd) && validateNonEmpty(req.body.name) && validateURL(req.body.link)) {
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
 */
