"use strict";

const router = require("express").Router(),
    homeRoutes = require("./homeRoutes"),
    contactRoutes = require("./contactRoutes"),
    productRoutes = require("./productRoutes"),
    shopRoutes = require("./shopRoutes"),
    cartRoutes = require("./cartRoutes"),
    orderRoutes = require("./orderRoutes"),
    accountRoutes = require("./accountRoutes"),
    errorRoutes = require("./errorRoutes");

router.use("/contact", contactRoutes);
router.use("/shop", shopRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/account", accountRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;