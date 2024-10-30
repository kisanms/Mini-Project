const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const mongoUrl = "mongodb://localhost:27017";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((e) => {
    console.log("Connection error:", e);
  });

app.get("/", (req, res) => {
  res.send({ statusbar: "Started" });
});

require("./UserDetails");
const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
  const { name, email, mobile, password, profileImage, gender } = req.body;

  // Check if user already exists
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.send({
      status: "error",
      data: "User already exists with this email",
    });
  }

  // Encrypt password
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    // Create new user with profile image and gender
    await User.create({
      name,
      email,
      mobile,
      password: encryptedPassword,
      profileImage,
      gender,
    });
    res.send({ status: "success", data: "User registered successfully" });
  } catch (error) {
    res.status(500).send({ statusbar: "error", data: error.message });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  // Find user by email
  const oldUser = await User.findOne({ email: email });
  if (!oldUser) {
    return res.send({ data: "User doesn't exist!" });
  }

  // Compare password
  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    console.log(token);
    if (res.status(201)) {
      return res.send({
        status: "ok",
        data: token,
        userType: oldUser.userType,
      });
    } else {
      return res.send({ error: "error" });
    }
  } else {
    return res.send({ data: "Incorrect password" });
  }
});

app.post("/userdata", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify token and retrieve user data
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;

    User.findOne({ email: useremail }).then((data) => {
      return res.send({ status: "Ok", data: data });
    });
  } catch (error) {
    return res.send({ error: "Invalid token" });
  }
});

// Create a Schema
const profileSchema = new mongoose.Schema({
  name: String,
  contactPerson: String,
  address: String,
  about: String,
  email: String,
});

// Create a Model
const Profile = mongoose.model("Profile", profileSchema);

// Endpoint to submit profile data
app.post("/api/profiles", async (req, res) => {
  const newProfile = new Profile(req.body);
  try {
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5001, () => {
  console.log("NodeJS server started on port 5001...");
});
