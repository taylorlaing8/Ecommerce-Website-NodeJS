"use strict";

const router = require("express").Router(),
    productController = require("../controllers/productController"),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    accountController = require("../controllers/accountController"),
    variationController = require("../controllers/variationController");

router.get("/:slug", productController.index, variationController.getAllVars, variationController.getAllVarTypes, productController.indexView);

// Verify Logged In & Admin
router.use(ensureLoggedIn("/login"));
router.use(accountController.verifyAdmin);

router.post("/update", productController.update, productController.redirectView);
router.post("/create", productController.create, productController.redirectView);
router.post("/:slug/add-image", productController.index, productController.addImage, productController.redirectView);
router.post("/:slug/remove", productController.remove, productController.redirectView);
router.get("/:slug/image/:imgId/remove", productController.removeImage, productController.redirectView);

module.exports = router;