"use strict";

const Subscriber = require("../models/subscriber"),
  httpStatus = require("http-status-codes");

module.exports = {
    subscribe: (req, res, next) => {
        let subsParams = {
            email: req.body.email,
            subscribed: true,
            subscribeDate: new Date()
        }

        Subscriber.create(subsParams)
        .then(subscriber => {
            req.flash("subscriberSuccess", `Subscribed!`);
            res.locals.redirect = "/"
            next();
        }).catch(error => {
            console.log(`Error subscribing: ${error.message}`)
            req.flash("subscriberError", `Error subscribing...`);
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