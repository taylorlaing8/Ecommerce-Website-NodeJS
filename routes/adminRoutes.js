"use strict";

const router = require("express").Router(),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    accountController = require("../controllers/accountController"),
    contactController = require("../controllers/contactController"),
    subscriberController = require("../controllers/subscriberController"),
    productController = require("../controllers/productController"),
    categoryController = require("../controllers/categoryController"),
    variationController = require("../controllers/variationController"),
    imageController = require("../controllers/imageController"),
    orderController = require("../controllers/orderController");

// Verify Logged In & Admin
router.use(ensureLoggedIn("/login"));
router.use(accountController.verifyAdmin);

router.get(
    "/",
    contactController.getAll,
    subscriberController.getAll,
    productController.getAll,
    categoryController.getAll,
    variationController.getAllVars,
    variationController.getAllVarTypes,
    imageController.getAll,
    accountController.getAll,
    // orderController.getAll,
    accountController.adminIndex
  );

router.get(
    "/products/:slug",
    productController.index,
    categoryController.getAll,
    variationController.getAllVars,
    variationController.getAllVarTypes,
    productController.adminIndexView
);

module.exports = router;