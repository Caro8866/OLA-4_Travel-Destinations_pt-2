import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import Destination from "../../schemas/traveldestination.js";
import User from "../../schemas/UserSchema.js";
import {
  validateNonEmpty,
  validateURL,
  validateDates,
} from "../utils/validate_helpers.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

dotenv.config();
const app = express();
const port = 3000;
const uri = "mongodb://127.0.0.1:27017";
const passportOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// middleware
passport.use(
  new JwtStrategy(passportOptions, async (jwt_payload, done) => {
    mongoose
      .connect(`${uri}/travelJournal`)
      .then(async () => {
        console.log("MongoDB Connected...");

        const user = await User.findOne({ id: jwt_payload.sub });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((error) => done(error, false))
      .finally(() => {
        console.log("MongoDB Connection Closed");
        mongoose.disconnect();
      });
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const options = {
  origin: [
    "http://127.0.0.1:5500/add.html",
    "http://127.0.0.1:5500/login.html",
    "http://127.0.0.1:5500/login",
    "http://127.0.0.1:5500",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["X-Requested-With, Content-type"],
};

app.get("/destinations", cors(options), (req, res) => {
  mongoose
    .connect(`${uri}/travelJournal`)
    .then(() => {
      console.log("MongoDB Connected...");
      Destination.find()
        .then((destinations) => res.status(200).json(destinations))
        .catch((err) =>
          res.status(500).json({ error: "Error Fetching Destinations:", err })
        )
        .finally(() => {
          console.log("MongoDB Connection Closed");
          mongoose.disconnect();
        });
    })
    .catch((error) => console.log(error));
});

app.get("/destinations/:id", cors(options), (req, res) => {
  mongoose
    .connect(`${uri}/travelJournal`)
    .then(() => {
      console.log("MongoDB Connected...");
      Destination.findById(req.params.id)
        .then((destination) => res.status(200).json(destination))
        .catch((err) =>
          res.status(500).json({ error: "Error Fetching Destination:", err })
        )
        .finally(() => {
          console.log("MongoDB Connection Closed");
          mongoose.disconnect();
        });
    })
    .catch((error) => console.log(error));
});

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
        .then((destination) => res.status(200).json(destination))
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

app.delete("/destinations/:id", cors(options), (req, res) => {
  mongoose
    .connect(`${uri}/travelJournal`)
    .then(() => {
      console.log("MongoDB Connected...");
      Destination.findByIdAndDelete(req.params.id)
        .then((destination) => res.status(200).json(destination))
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

app.post("/auth/login", cors(options), (req, res, next) => {
  mongoose.connect(`${uri}/travelJournal`).then(() => {
    console.log("MongoDB Connected...");

    if (req.body.cred.includes("@")) {
      User.findOne({ email: req.body.cred })
        .then(async (user) => {
          if (await user.isValidPassword(req.body.password)) {
            const tokenObject = jsonwebtoken.sign(
              { _id: user._id },
              process.env.JWT_SECRET
            );
            res.status(200).json({
              success: true,
              token: tokenObject,
            });
          } else {
            res.status(401).json({ success: false, msg: "Invalid login" });
            return;
          }
        })
        .catch((err) => {
          res.status(401).json({ success: false, msg: "Invalid login" });
        })
        .finally(() => {
          console.log("MongoDB Connection Closed");
          mongoose.disconnect();
        });
    } else {
      User.findOne({ username: req.body.cred })
        .then(async (user) => {
          if (await user.isValidPassword(req.body.password)) {
            const tokenObject = jsonwebtoken.sign(
              { _id: user._id },
              process.env.JWT_SECRET
            );
            res.status(200).json({
              success: true,
              token: tokenObject,
            });
          } else {
            res.status(401).json({ success: false, msg: "Invalid login" });
            return;
          }
        })
        .catch((err) => {
          res.status(401).json({ success: false, msg: "Invalid login" });
        })
        .finally(() => {
          console.log("MongoDB Connection Closed");
          mongoose.disconnect();
        });
    }
  });
});

app.post("/auth/signup", cors(options), (req, res) => {
  mongoose.connect(`${uri}/travelJournal`).then(async () => {
    console.log("MongoDB Connected...");

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    newUser
      .save()
      .then((user) => {
        res.json({ success: true, user: user });
      })
      .catch((err) => res.json({ success: false, msg: err }))
      .finally(() => {
        console.log("MongoDB Connection Closed");
        mongoose.disconnect();
      });
  });
});

// only for testing purposes can be removed later
// app.get("/auth/protected", passport.authenticate("jwt", { session: false }), function (req, res, next) {
//   mongoose
//     .connect(`${uri}/travelJournal`)
//     .then(() => {
//         res.status(200).json({
//           success: true,
//           msg: "You are successfully authenticated to this route!",
//         });
//     })
// }
// );

app.listen(port, () => {
  console.log(`Server is running at: http:localhost:${port}`);
});
