"use strict";

const Variation = require("../models/variation"),
    VariationType = require("../models/variationType"),
    Product = require("../models/product"),
    httpStatus = require("http-status-codes");

module.exports = {
    index: (req, res, next) => {
        let varSlug = req.params.slug;
        Variation.findOne({ slug: varSlug }).populate('type')
            .then(variation => {
                res.locals.variation = variation;
                next();
            }).catch(err => {
                console.log(`Error retrieving variation: ${error.message}`);
                next(error);
            })
    },
    getAllVars: (req, res, next) => {
        Variation.find({}).populate('type')
            .then(variations => {
                res.locals.variations = variations;
                next();
            }).catch(err => {
                console.log(`Error retrieving variations: ${err.message}`);
                next(err);
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
    create: (req, res, next) => {
        let varParams = {
            name: req.body.name,
            type: req.body.type,
            slug: req.body.slug
        };

        Variation.create(varParams)
            .then(variation => {
                req.flash("success", `Variation Created Successfully!`);
                res.locals.redirect = `/admin/variation/${variation.slug}`;
                res.locals.variation = variation;
                next();
            })
            .catch(error => {
                req.flash("error", `Error creating variation.`);
                res.locals.redirect = `/admin/variation/create`;
                next();
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
    update: (req, res, next) => {
        let varParams = {
            name: req.body.name,
            type: req.body.type,
            slug: req.body.slug
        };

        Variation.findByIdAndUpdate(req.body.id, {
            $set: varParams
        }).then(variation => {
            req.flash("success", `Variation Updated Successfully!`);
            res.locals.redirect = `/admin/variation/${variation.slug}`;
            res.locals.variation = variation;
            next();
        }).catch(error => {
            req.flash("error", `Error saving variation.`);
            res.locals.redirect = `/admin/variation/${varParams.slug}`;
            next();
        })
    },
    remove: (req, res, next) => {
        let varSlug = req.params.slug;
        
        Variation.findOne({
            slug: varSlug
        }).then(v => {
            Product.updateMany( 
                { variations: { $in: v._id }},
                { $pull: { variations: v._id }}
            ).then(() => {
                Variation.findByIdAndDelete(v._id)
                .then(() => {
                    req.flash("success", `Variation Removed Successfully!`);
                    res.locals.redirect = `/admin`;
                    next();
                })
            })
        }).catch(err => {
            req.flash("error", `Error removing variation.`);
            res.locals.redirect = `/admin/variation/${varSlug}`;
            next();
        })
    },
    adminIndexView: (req, res) => {
        if (!res.locals.variation) res.locals.variation = null;
        res.render("admin/variation/index");
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}