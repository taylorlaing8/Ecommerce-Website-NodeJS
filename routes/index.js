"use strict";

const router = require("express").Router(),
    homeRoutes = require("./homeRoutes"),
    contactRoutes = require("./contactRoutes"),
    subscriberRoutes = require("./subscriberRoutes"),
    productRoutes = require("./productRoutes"),
    categoryRoutes = require("./categoryRoutes"),
    variationRoutes = require("./variationRoutes"),
    imageRoutes = require("./imageRoutes"),
    shopRoutes = require("./shopRoutes"),
    cartRoutes = require("./cartRoutes"),
    orderRoutes = require("./orderRoutes"),
    accountRoutes = require("./accountRoutes"),
    adminRoutes = require("./adminRoutes"),
    apiRoutes = require("./apiRoutes"),
    errorRoutes = require("./errorRoutes"),
    categoryController = require("../controllers/categoryController");;

router.use(categoryController.getAll);
    
router.use("/contact", contactRoutes);
router.use("/subscriber", subscriberRoutes);
router.use("/shop", shopRoutes);
router.use("/product", productRoutes);
router.use("/category", categoryRoutes);
router.use("/variation", variationRoutes);
router.use("/image", imageRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/account", accountRoutes);
router.use("/admin", adminRoutes);
router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;