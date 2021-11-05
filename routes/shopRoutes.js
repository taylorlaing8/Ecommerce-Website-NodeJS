"use strict";

const router = require("express").Router(),
    shopController = require("../controllers/shopController");

router.get("/", shopController.index);
router.get("/category", shopController.filterCategory, shopController.filterCategoryView);

module.exports = router;