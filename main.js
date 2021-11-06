'use strict';

// Import needed modules
const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator"),
  User = require("./models/user");

// Set application variables
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

// Mongoose database setup
mongoose.connect(
	'mongodb+srv://admin:DevPass$8@is5050-cluster.eqzfs.mongodb.net/covert_tees?retryWrites=true&w=majority'
);
const db = mongoose.connection;
db.once('open', () => {
	console.log('Successfully connected to MongoDB using Mongoose');
});

// Mongoose Promises
mongoose.Promise = global.Promise;

// Set up application middleware
app.use(express.static('public'));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", router);

// Launch the server
app.listen(app.get('port'), () => {
	console.log(`Server running at http://localhost:${app.get('port')}`);
});
