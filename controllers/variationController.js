"use strict";

const Variation = require("../models/variation"),
    httpStatus = require("http-status-codes");

module.exports = {
    getAll: (req, res, next) => {
        Variation.find({})
        .then(variations => {
            res.locals.variations = variations;  
            next();
        }).catch(err => {
            console.log(`Error retrieving variations: ${error.message}`);
            next(error);
        })
    },
    getOne: (req, res, next) => {
        let varSlug = req.params.varSlug;
        Variation.findOne({ slug: varSlug })
        .then(variation => {
            res.locals.variation = variation;
            next();
        }).catch(err => {
            console.log(`Error retrieving variation: ${error.message}`);
            next(error);
        })
    },
    create: (req, res, next) => {
        let varParams = {
            name: req.body.name,
            slug: req.body.slug
        };

        Variation.create(varParams)
        .then(variation => {
            next();
        })
        .catch(error => {
            console.log(`Error saving variation: ${error.message}`);
            next(error);
        })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}