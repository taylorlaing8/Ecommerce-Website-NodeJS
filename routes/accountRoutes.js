"use strict";

const router = require("express").Router(),
  accountController = require("../controllers/accountController");

// Verify logged in
router.use(accountController.verifyLoggedIn);

router.get("/", accountController.index);
router.get("/logout", accountController.logout, accountController.redirectView);
router.get("/edit", accountController.edit);
router.delete("/delete", accountController.delete, accountController.redirectView);
router.post("/update/:type", accountController.update, accountController.redirectView);

module.exports = router;