"use strict";

// Import needed modules
const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  mongoose = require("mongoose"),
  layouts = require("express-ejs-layouts");