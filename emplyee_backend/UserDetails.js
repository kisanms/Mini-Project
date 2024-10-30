const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    mobile: String,
    password: String,
    profileImage: String, // Field for storing profile image URL
    gender: String, // Field for storing gender
    profession: String, // Field for storing
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", UserDetailSchema);
