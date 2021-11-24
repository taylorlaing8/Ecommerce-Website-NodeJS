"use strict";

const router = require("express").Router(),
    productController = require("../controllers/productController");

router.post("/update", productController.update, productController.redirectView);
router.post("/create", productController.create, productController.redirectView);
router.get("/:slug", productController.index, productController.indexView);

module.exports = router;