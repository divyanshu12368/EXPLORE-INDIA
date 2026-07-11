import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/0?v=4",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;