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

// Dashboard
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

// Products Controller
router.get(
    "/product/create",
    categoryController.getAll,
    variationController.getAllVars,
    variationController.getAllVarTypes,
    productController.adminIndexView
);
router.get(
    "/product/:slug",
    productController.index,
    categoryController.getAll,
    variationController.getAllVars,
    variationController.getAllVarTypes,
    productController.adminIndexView
);

// Categories Controller
router.get(
    "/category/create",
    categoryController.adminIndexView
);
router.get(
    "/category/:slug",
    categoryController.index,
    categoryController.adminIndexView
);

// Variations Controller
router.get(
    "/variation/create",
    variationController.getAllVarTypes,
    variationController.adminIndexView
);
router.get(
    "/variation/:slug",
    variationController.index,
    variationController.getAllVarTypes,
    variationController.adminIndexView
);

// Users Controller
router.get(
    "/user/:id/remove",
    accountController.delete,
    accountController.redirectView
)
router.get(
    "/user/:id/:admin/toggle-admin",
    accountController.toggleAdmin,
    accountController.redirectView
)

module.exports = router;