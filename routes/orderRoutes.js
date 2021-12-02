"use strict";

const router = require("express").Router(),
    orderController = require("../controllers/orderController"),
    cartController = require("../controllers/cartController");

router.get("/", orderController.index);
router.get("/:id/invoice", orderController.index, cartController.showInvoice)

module.exports = router;