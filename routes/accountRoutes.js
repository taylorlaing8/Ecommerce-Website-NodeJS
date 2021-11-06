"use strict";

const router = require("express").Router(),
    accountController = require("../controllers/accountController");

router.get("/", accountController.index);

module.exports = router;