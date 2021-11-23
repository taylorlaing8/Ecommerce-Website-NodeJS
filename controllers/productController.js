"use strict";

const Product = require("../models/product"),
    httpStatus = require("http-status-codes");

module.exports = {
    index: (req, res, next) => {
        let prodSlug = req.params.slug;
        Product.findOne({ slug: prodSlug }).populate('category').populate('images')
        .then(product => {
            if (product) {
                res.locals.product = product;
                next();
            } else {
                res.render("error/pageNoteFound");
            }
        })
        .catch(error => {
            console.log(`Error fetching product by Slug: ${error.message}`);
            next(error);
        });
    },
    indexView: (req, res) => {
        res.render("product/index");
    },
    create: (req, res, next) => {
        let prodParams = {
            slug: req.body.slug,
            sku: req.body.sku,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            variation: req.body.variation,
            category: req.body.category,
            images: [req.body.images]
        };

        Product.create(prodParams)
        .then(product => {
            res.locals.redirect = "/product";
            res.locals.product = product;
            next();
        })
        .catch(error => {
            console.log(`Error saving product: ${error.message}`);
            next(error);
        })
    },
    update: (req, res, next) => {
        let prodParams = {
            slug: req.body.slug,
            sku: req.body.sku,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            // variation: [req.body.variation],
            category: req.body.category,
            // images: [req.body.images]
        };

        Product.create(prodParams)
        .then(product => {
            res.locals.redirect = "/product";
            res.locals.product = product;
            next();
        })
        .catch(error => {
            console.log(`Error saving product: ${error.message}`);
            next(error);
        })
    },
    addImage: (req, res, next) => {
        let imageId = req.query.id,
          currentProduct = req.query.product;
        if (currentProduct) {
            Product.findByIdAndUpdate(currentProduct, {
            $addToSet: {
                images: imageId
            }
          })
            .then(() => {
              res.locals.success = true;
              next();
            })
            .catch(error => {
              next(error);
            });
        } else {
          next(new Error("No product found with id"));
        }
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}