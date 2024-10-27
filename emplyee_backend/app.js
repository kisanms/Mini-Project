const express = require("express");
const app = express();
const mongoose = require("mongoose");

const mongoUrl = "mongodb://localhost:27017";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("database connection established");
  })
  .catch((e) => {
    console.log("connection error");
  });

app.get("/", (req, res) => {
  res.send({ statusbar: "Started" });
});
require("./UserDetails");
const User = mongoose.model("UserInfo");
app.post("/register", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res
      .status(409)
      .send({
        statusbar: "error",
        data: "User already exists with this email",
      });

  try {
    await User.create({ name: name, email: email, mobile, password });
    res
      .status(201)
      .send({ statusbar: "success", data: "User registered successfully" });
  } catch (error) {
    res.status(500).send({ statusbar: "error", data: error.message });
  }
});

app.listen(5001, () => {
  console.log("NodeJS server started...");
});
