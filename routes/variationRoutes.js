"use strict";

const router = require("express").Router(),
    variationController = require("../controllers/variationController");

router.post("/create", variationController.create, variationController.redirectView);
router.post("/update", variationController.update, variationController.redirectView);
router.get("/:slug", variationController.index, variationController.redirectView);
router.post("/:slug/remove", variationController.remove, variationController.redirectView);

module.exports = router;