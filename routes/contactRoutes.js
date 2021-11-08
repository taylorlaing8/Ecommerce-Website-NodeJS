"use strict";

const router = require("express").Router(),
    contactController = require("../controllers/contactController");

router.get("/", contactController.index);
router.post("/submit", contactController.submit, contactController.redirectView);

module.exports = router;