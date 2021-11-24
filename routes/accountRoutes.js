"use strict";

const router = require("express").Router(),
  accountController = require("../controllers/accountController"),
  ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// Verify logged in
router.use(ensureLoggedIn("/login"));

router.get("/", accountController.index);
router.get("/logout", accountController.logout, accountController.redirectView);
router.get("/edit", accountController.edit);
router.delete("/delete", accountController.delete, accountController.redirectView);
router.post("/update", accountController.updateGeneral, accountController.redirectView);

module.exports = router;