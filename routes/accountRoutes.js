"use strict";

const router = require("express").Router(),
  accountController = require("../controllers/accountController"),
  ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.post(
  "/create",
  accountController.validate,
  accountController.create,
  accountController.redirectView
);

// Verify logged in
router.use(ensureLoggedIn("/login"));

router.get("/", accountController.index, accountController.indexView);
router.get("/logout", accountController.logout, accountController.redirectView);
router.delete("/delete", accountController.delete, accountController.redirectView);
router.post("/update", accountController.updateGeneral, accountController.redirectView);
router.post("/update/shipping", accountController.updateAddress, accountController.redirectView);

module.exports = router;