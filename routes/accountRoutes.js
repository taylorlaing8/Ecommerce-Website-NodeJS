"use strict";

const router = require("express").Router(),
    accountController = require("../controllers/accountController");

router.get("/", accountController.index, accountController.redirectView);
router.post(
  "/create",
  accountController.validate,
  accountController.create,
  accountController.redirectView
);
router.get("/login", accountController.login);
router.post("/login", accountController.authenticate);
router.get("/logout", accountController.logout, accountController.redirectView);
router.get("/edit", accountController.edit);
router.put("/update", accountController.update, accountController.redirectView);
router.delete("/delete", accountController.delete, accountController.redirectView);

module.exports = router;