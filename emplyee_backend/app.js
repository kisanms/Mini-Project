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
    return res.send({
      status: "error",
      data: "User already exists with this email",
    });
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({
      name: name,
      email: email,
      mobile,
      password: encryptedPassword,
    });
    res.send({ status: "success", data: "User registered successfully" });
  } catch (error) {
    res.status(500).send({ statusbar: "error", data: error.message });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const oldUser = await User.findOne({ email: email });

  if (!oldUser) {
    return res.send({ data: "User doesn't exists!!" });
  }

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
  }
});
app.post("/userdata", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;

    User.findOne({ email: useremail }).then((data) => {
      return res.send({ status: "Ok", data: data });
    });
  } catch (error) {
    return res.send({ error: error });
  }
});

app.listen(5001, () => {
  console.log("NodeJS server started...");
});
