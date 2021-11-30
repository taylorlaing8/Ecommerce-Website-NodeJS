"use strict";

const Order = require("../models/order");
const path = require("path");
require("dotenv").config({path: path.join(__dirname, "..", ".env")});
const stripe = require('stripe')(process.env.STRIPE_SEC_KEY);

module.exports = {
    getCart: (req, res, next) => {
        let cart = req.session.cart ? Order.hydrate(req.session.cart) : new Order();
        req.cart = cart;
        next();
    },
    saveCart: (req, res, next) => {
        req.session.cart = req.cart;
        res.redirect("/cart/view");
    },
    index: (req, res, next) => {
        let cart = req.cart;
        // console.log(cart);
        if (cart.items.length > 0) {
            res.render("cart/view", { cart: cart, stripePubKey: process.env.STRIPE_PUB_KEY });
        } else {
            res.render("cart/empty");
        }
    },
    addToCart: (req, res, next) => {
        let cart = req.cart;
        let item = {
            _id: req.body._id,
            title: req.body.title,
            price: req.body.price
        };
        cart.addItem(item);
        next();
    },
    removeFromCart: (req, res, next) => {
        let idToRemove = req.params.id;
        let cart = req.cart;
        if (cart.findItem(idToRemove)) {
            cart.removeItem(idToRemove);
        }
        next();
    },
    updateQuantity: (req, res, next) => {
        let idToUpdate = req.body.id;
        let quantity = parseInt(req.body.quantity);
        let cart = req.cart;
        let itemToUpdate = cart.findItem(idToUpdate);
        if (itemToUpdate && quantity) {
            itemToUpdate.updateQuantity(quantity);
        }
        next();
    },
    saveOrder: async (req, res, next) => {
        let userId = req.user._id;
        let cart = req.cart;
        if (cart.items.length > 0) {
            cart.user = userId;
            if (await Order.findById(cart._id)) {
                cart.isNew = false;
                cart.markModified("items");
            } else {
                cart.isNew = true;
            }

            try {
                let savedOrder = await cart.save();
                res.locals.orderId = savedOrder._id;
                next();
            } catch (error) {
                console.log(error);
                next(error);
            }
        }
    },
    stripeCheckout: async (req, res) => {
        let cart = req.cart;

        let stripeLineItems = [];
        cart.items.forEach(item => {
            stripeLineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })
        });
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            client_reference_id: res.locals.orderId.toString(),
            customer_email: req.user.email,
            line_items: stripeLineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/cart/confirm?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cart/view`,
        });
        res.redirect(stripeSession.url);
    },
    confirmPayment: async (req, res, next) => {
        const stripeSession = await stripe.checkout.sessions.retrieve(req.query.session_id);
     
        if (stripeSession.payment_status === "paid") {
            res.locals.stripeSession = stripeSession.id;
            res.locals.paymentStatus = stripeSession.payment_status;
            res.locals.orderId = stripeSession.client_reference_id;
            try {
                await Order.findByIdAndUpdate(res.locals.orderId, {
                    paid: true,
                    paymentId: stripeSession.id,
                    paymentDate: new Date()
                });
                next();
            } catch (error) {
                next(error);
            }
        }
    },
    resetCart: (req, res, next) => {
        req.session.cart = res.locals.cart = null;
        next();
    },
    showInvoice: async (req, res, next) => {
        try {
            let order = await Order.findById(res.locals.orderId).populate("user");
            res.render("cart/invoice", { order: order });
        } catch (error) {
            console.log(error);
        }
    },
};