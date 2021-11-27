"use strict";

const router = require("express").Router(),
    homeController = require("../controllers/homeController"),
    accountController = require("../controllers/accountController");

router.get("/", homeController.index);
router.get("/about", homeController.about);

router.get("/login", accountController.login);
router.post("/login", accountController.authenticate);

module.exports = router;