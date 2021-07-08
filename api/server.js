// BUILD YOUR SERVER HERE
const express = require("express");
const User = require("./users");

// Instance of Express App
const app = express();

//Global Middleware
app.use(express.json());

module.exports = app; // EXPORT YOUR SERVER instead of {}
