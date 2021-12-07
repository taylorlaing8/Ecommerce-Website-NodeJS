"use strict";

const router = require("express").Router(),
    homeController = require("../controllers/homeController"),
    categoryController = require("../controllers/categoryController"),
    productController = require("../controllers/productController"),
    accountController = require("../controllers/accountController");

router.get("/", categoryController.getThree, productController.getThree, homeController.index);
router.get("/about", homeController.about);

router.get("/login", accountController.login);
router.post("/login", accountController.authenticate);

module.exports = router;