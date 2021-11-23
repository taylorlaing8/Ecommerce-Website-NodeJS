"use strict";

const Contact = require("../models/contact"),
  httpStatus = require("http-status-codes");

module.exports = {
    index: (req, res) => {
        res.render("contact/index");
    },
    getAll: (req, res, next) => {
        Contact.find({})
        .then(contacts => {
            res.locals.contacts = contacts;
            next();
        }).catch(err => {
            console.log(`Error retrieving contact submissions: ${err.message}`);
            next(err);
        })
    },
    submit: (req, res, next) => {
        let contParams = {
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        }

        Contact.create(contParams)
        .then(contact => {
            req.flash("contactSuccess", `Contact form submitted! We will reach out to you shortly.`);
            res.locals.redirect = "/contact"
            next();
        }).catch(error => {
            console.log(`Error submitting contact form: ${error.message}`)
            req.flash("contactError", `Error submitting contact form. Please try again.`);
            res.locals.redirect = "/contact";
            next();
        })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}