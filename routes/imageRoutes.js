"use strict";

const router = require("express").Router(),
    imageController = require("../controllers/imageController");

router.post("/upload", imageController.upload);

module.exports = router;