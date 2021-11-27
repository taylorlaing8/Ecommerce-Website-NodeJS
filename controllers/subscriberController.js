"use strict";

const Subscriber = require("../models/subscriber"),
  httpStatus = require("http-status-codes");

module.exports = {
    getAll: (req, res, next) => {
        Subscriber.find({})
        .then(subscribers => {
            res.locals.subscribers = subscribers;
            next();
        }).catch(err => {
            console.log(`Error retrieving subscribers: ${err.message}`);
            next(err);
        })
    },
    subscribe: (req, res, next) => {
        let email = req.body.email;

        Subscriber.create({email})
        .then(subscriber => {
            req.flash("subscriberSuccess", `Subscribed!`);
            res.locals.redirect = "/"
            next();
        }).catch(error => {
            if(error.code == 11000) {
                req.flash("subscriberError", `Already Subscribed...`);
            } else {
                req.flash("subscriberError", `Error subscribing...`);
            }
            res.locals.redirect = "/"
            next();
        })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}