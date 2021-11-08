"use strict";

const router = require("express").Router(),
    subscriberController = require("../controllers/subscriberController");

router.post("/subscribe", subscriberController.subscribe, subscriberController.redirectView);

module.exports = router;