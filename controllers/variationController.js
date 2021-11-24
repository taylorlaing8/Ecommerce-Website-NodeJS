"use strict";

const Variation = require("../models/variation"),
    VariationType = require("../models/variationType"),
    httpStatus = require("http-status-codes");

module.exports = {
    getAllVars: (req, res, next) => {
        Variation.find({}).populate('type')
        .then(variations => {
            res.locals.variations = variations;  
            next();
        }).catch(err => {
            console.log(`Error retrieving variations: ${error.message}`);
            next(error);
        })
    },
    getOneVar: (req, res, next) => {
        let varSlug = req.params.varSlug;
        Variation.findOne({ slug: varSlug }).populate('type')
        .then(variation => {
            res.locals.variation = variation;
            next();
        }).catch(err => {
            console.log(`Error retrieving variation: ${error.message}`);
            next(error);
        })
    },
    getAllVarTypes: (req, res, next) => {
        VariationType.find({})
        .then(variationTypes => {
            res.locals.variationTypes = variationTypes;  
            next();
        }).catch(err => {
            console.log(`Error retrieving variation types: ${error.message}`);
            next(error);
        })
    },
    getOneVarType: (req, res, next) => {
        let varTypeSlug = req.params.varTypeSlug;
        Variation.findOne({ slug: varTypeSlug })
        .then(variationType => {
            res.locals.variationType = variationType;
            next();
        }).catch(err => {
            console.log(`Error retrieving variation type: ${error.message}`);
            next(error);
        })
    },
    create: (req, res, next) => {
        let varParams = {
            name: req.body.name,
            type: req.body.type,
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
    createType: (req, res, next) => {
        let varTypeParams = {
            name: req.body.name,
            slug: req.body.slug
        };

        VariationType.create(varTypeParams)
        .then(variationType => {
            next();
        })
        .catch(error => {
            console.log(`Error saving variation type: ${error.message}`);
            next(error);
        })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}