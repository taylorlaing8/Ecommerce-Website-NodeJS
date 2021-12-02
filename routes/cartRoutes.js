"use strict";
const router = require("express").Router(),
    cartController = require("../controllers/cartController"),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.use(cartController.getCart);

router.post("/add", cartController.addToCart, cartController.saveCart);
router.post("/update", cartController.updateQuantity, cartController.saveCart);
router.post("/remove/:id", cartController.removeFromCart, cartController.saveCart);

router.get("/checkout", ensureLoggedIn("/login"), cartController.index);
router.post("/stripecheckout", cartController.saveOrder, cartController.stripeCheckout);
router.get("/confirm", cartController.confirmPayment, cartController.resetCart, cartController.showInvoice);

router.get("/", cartController.index);

module.exports = router;