"use strict";

const router = require("express").Router(),
    accountController = require("../controllers/accountController"),
    productController = require("../controllers/productController");

router.post("/login", accountController.apiAuthenticate);
router.use(accountController.verifyJWT);

// Get Products
router.get(
    "/products",
    productController.getAll,
    productController.respondJSON
);

module.exports = router;