import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: String,
    password: String,
  });

UserSchema.methods.isValidPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.pre("save", async function(next) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model("User", UserSchema);

export default User;
