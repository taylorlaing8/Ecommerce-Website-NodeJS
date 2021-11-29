"use strict";

const router = require("express").Router(),
    imageController = require("../controllers/imageController");

router.post("/upload", imageController.upload);
router.post("/update", imageController.update, imageController.redirectView);
router.post("/:id/remove", imageController.remove, imageController.redirectView);

module.exports = router;