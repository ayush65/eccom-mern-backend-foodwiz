/** @format */

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

require("../db/conn");

const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("hello world hi from ayush Prakash boom");
});

router.post("/register", async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;

  if (!name || !email || !phone || !password || !cpassword) {
    return res.status(422).json({ error: "its a eror" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "This user is already registered" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "passwords are not matching" });
    }

    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: password,
      cpassword: cpassword,
    });

    const userRegister = user.save();
    if (userRegister) {
      return res.status(201).json({ message: "user registered succesfully" });
    }
  } catch (e) {
    console.log(e.message);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Plz Fill The data properly" });
    }

    const userLogin = await User.findOne({ email: email });
    //console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      console.log(token);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ message: "invalid  credentials" });
      } else {
        res.json({ message: "User signin Succesfully" });
      }
    } else {
      res.status(400).json({ message: "invalid  credentials" });
    }

    if (!userLogin) {
      res.json({ error: "User Error succesfull" });
    } else {
      res.json({ message: "User Signin succesfull" });
    }
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
