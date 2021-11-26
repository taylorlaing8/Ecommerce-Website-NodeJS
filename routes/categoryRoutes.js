"use strict";

const router = require("express").Router(),
    categoryController = require("../controllers/categoryController");

router.post("/update", categoryController.update, categoryController.redirectView);
router.post("/create", categoryController.create, categoryController.redirectView);
router.post("/:slug/remove", categoryController.remove, categoryController.redirectView);

module.exports = router;