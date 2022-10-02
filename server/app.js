/** @format */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const app = express();

dotenv.config({ path: "./config.env" });
require("./db/conn");
app.use(express.json());

const User = require("./model/userSchema");
const PORT = process.env.PORT;

app.use(require("./router/auth"));

app.listen(PORT, () => {
  console.log(`sever is running  ${PORT}`);
});
