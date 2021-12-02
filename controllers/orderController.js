"use strict";

const Order = require("../models/order");

module.exports = {
    index: (req, res, next) => {
        let orderId = req.params.id;

        Order.findById(orderId)
        .then(order => {
            res.locals.orderId = order._id;
            next();
        }).catch(err => {
            req.flash("error", "Error fetching order");
            res.redirect("/account");
        })
    },
    getAll: (req, res, next) => {
        Order.find({})
        .then(orders => {
            res.locals.orders = orders;
            next();
        }).catch(err => {
            req.flash("error", "Error fetching orders");
            res.redirect("/admin");
        })
    }
}