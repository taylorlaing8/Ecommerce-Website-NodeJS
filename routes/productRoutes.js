"use strict";

const router = require("express").Router(),
    productController = require("../controllers/productController");

router.get("/", productController.index);

module.exports = router;