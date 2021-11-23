"use strict";

const router = require("express").Router(),
  accountController = require("../controllers/accountController"),
  contactController = require("../controllers/contactController"),
  subscriberController = require("../controllers/subscriberController"),
  productController = require("../controllers/productController"),
  categoryController = require("../controllers/categoryController"),
  variationController = require("../controllers/variationController"),
  imageController = require("../controllers/imageController"),
  orderController = require("../controllers/orderController");

// Verify logged in
router.use(accountController.verifyLoggedIn);

router.get("/", accountController.index);
router.get("/logout", accountController.logout, accountController.redirectView);
router.get("/edit", accountController.edit);
router.delete("/delete", accountController.delete, accountController.redirectView);
router.post("/update", accountController.updateGeneral, accountController.redirectView);

// Verify Admin
router.use(accountController.verifyAdmin);

router.get(
  "/admin",
  contactController.getAll,
  subscriberController.getAll,
  productController.getAll,
  categoryController.getAll,
  variationController.getAll,
  imageController.getAll,
  accountController.getAll,
  // orderController.getAll,
  accountController.adminIndex);

module.exports = router;