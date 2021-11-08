"use strict";

const router = require("express").Router(),
    productController = require("../controllers/productController");

// router.get("/", productController.index, productController.indexView);
router.get("/:slug", productController.index, productController.indexView);
router.post("/create", productController.create, productController.redirectView)

module.exports = router;