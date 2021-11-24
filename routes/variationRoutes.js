"use strict";

const router = require("express").Router(),
    variationController = require("../controllers/variationController");

router.get("/", variationController.getAllVars);
router.post("/create", variationController.create);
router.post("/type/create", variationController.createType);
router.get("/type/all", variationController.getAllVarTypes);
router.get("/type/single/:varTypeSlug", variationController.getOneVarType);
router.get("/single/:varSlug", variationController.getOneVar);

module.exports = router;