"use strict";

const router = require("express").Router(),
    shopController = require("../controllers/shopController"),
    categoryController = require("../controllers/categoryController");

router.get("/", shopController.index, shopController.indexView);
router.get("/:slug", categoryController.index, categoryController.indexView);

module.exports = router;