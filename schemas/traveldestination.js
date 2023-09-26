import mongoose from "mongoose";
const { Schema } = mongoose;

const DestinationSchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  dateStart: { type: Date },
  dateEnd: { type: Date },
  description: { type: String }, // corrected typo here
  link: { type: String },
  image: { type: String },
});

const Destination = mongoose.model("Destination", DestinationSchema);

export default Destination;
