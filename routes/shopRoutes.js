"use strict";

const router = require("express").Router(),
    shopController = require("../controllers/shopController"),
    categoryController = require("../controllers/categoryController"),
    productController = require("../controllers/productController");

// router.get("/", shopController.index, shopController.indexView);
router.get("/", categoryController.getAll, productController.getAll, shopController.indexView);
router.get("/:slug", categoryController.index, categoryController.indexView);

module.exports = router;