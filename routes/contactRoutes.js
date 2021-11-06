"use strict";

const router = require("express").Router(),
    contactController = require("../controllers/contactController");

router.get("/", contactController.index);

module.exports = router;