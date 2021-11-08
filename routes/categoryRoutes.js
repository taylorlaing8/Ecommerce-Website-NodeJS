"use strict";

const router = require("express").Router(),
    categoryController = require("../controllers/categoryController");

router.post("/create", categoryController.create, categoryController.redirectView);

module.exports = router;