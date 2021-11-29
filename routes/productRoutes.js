"use strict";

const router = require("express").Router(),
    productController = require("../controllers/productController");

router.post("/update", productController.update, productController.redirectView);
router.post("/create", productController.create, productController.redirectView);
router.get("/:slug", productController.index, productController.indexView);
router.post("/:slug/add-image", productController.index, productController.addImage, productController.redirectView);
router.post("/:slug/remove", productController.remove, productController.redirectView);
router.get("/:slug/image/:imgId/remove", productController.removeImage, productController.redirectView);

module.exports = router;