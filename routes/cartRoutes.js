"use strict";

const router = require("express").Router(),
    cartController = require("../controllers/cartController");

router.get("/", cartController.index);

module.exports = router;