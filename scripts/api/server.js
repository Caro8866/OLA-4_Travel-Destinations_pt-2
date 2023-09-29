import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import Destination from "../../schemas/traveldestination.js";
import {
  validateNonEmpty,
  validateURL,
  validateDates,
} from "../utils/validate_helpers.js";

const app = express();
const port = 3000;

const uri = "mongodb://127.0.0.1:27017";

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
  // connecting to the database
  mongoose
    .connect(`${uri}/travelJournal`)
    .then(() => {
      console.log("MongoDB Connected...");
      Destination.find()
        .then((destinations) => res.json(destinations))
        .catch((err) =>
          res.status(500).json({ error: "Error Fetching Destinations:", err })
        )
        .finally(() => {
          // closing db connection disregarding the status
          console.log("MongoDB Connection Closed");
          mongoose.disconnect();
        });
    })
    .catch((error) => console.log(error));
});

// POST a new destination
app.post("/destinations", cors(options), (req, res) => {
  mongoose
    .connect(`${uri}/travelJournal`)
    .then(() => {
      console.log("MongoDB Connected...");
      if (
        validateNonEmpty(req.body.country) &&
        validateDates(req.body.dateStart, req.body.dateEnd) &&
        validateNonEmpty(req.body.name) &&
        validateURL(req.body.link)
      ) {
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
          .then((response) => {
            const resID = new mongoose.Types.ObjectId(response.insertedId);
            console.log(resID);
            res.status(201).json({ insertedID: resID });
          })
          .catch((err) => console.error("Error Saving Destination:", err))
          .finally(() => {
            console.log("MongoDB Connection Closed");
            mongoose.disconnect();
          });
      }
    })
    .catch((error) => console.log(error));
});

// PUT a destination
app.put("/destinations/:id", cors(options), (req, res) => {
  mongoose
    .connect(`${uri}/travelJournal`)
    .then(() => {
      console.log("MongoDB Connected...");
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
        .catch((err) =>
          res.status(500).json({ error: "Error Updating Destination:", err })
        )
        .finally(() => {
          console.log("MongoDB Connection Closed");
          mongoose.disconnect();
        });
    })
    .catch((error) => console.log(error));
});

// DELETE a destination
app.delete("/destinations/:id", cors(options), (req, res) => {
  mongoose
    .connect(`${uri}/travelJournal`)
    .then(() => {
      console.log("MongoDB Connected...");
      Destination.findByIdAndDelete(req.params.id)
        .then((destination) => res.json(destination))
        .catch((err) =>
          res.status(500).json({ error: "Error Deleting Destination:", err })
        )
        .finally(() => {
          console.log("MongoDB Connection Closed");
          mongoose.disconnect();
        });
    })
    .catch((error) => console.log(error));
});

app.listen(port, () => {
  console.log(`Server is running at: http:localhost:${port}`);
});
