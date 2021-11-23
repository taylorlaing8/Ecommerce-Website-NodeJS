"use strict";

const router = require("express").Router(),
    variationController = require("../controllers/variationController");

router.get("/", variationController.getAll);
router.post("/create", variationController.create);
router.get("/single/:varSlug", variationController.getOne);

module.exports = router;