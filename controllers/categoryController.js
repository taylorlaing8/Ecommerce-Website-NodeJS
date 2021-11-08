"use strict";

const Category = require("../models/category"),
  httpStatus = require("http-status-codes"),
  Product = require("../models/product");

module.exports = {
  index: (req, res, next) => {
    let catSlug = req.params.slug;

    Category.findOne({ slug: catSlug })
    .then(category => {
      if (category) {
        res.locals.category = category;
        return category;
      } else {
        res.render("error/pageNoteFound");
      }
    })
    .then(category => {
      Product.find({ category: category._id }).populate('images')
      .then( products => {
        res.locals.products = products;
        next();
      }).catch(error => {
        console.log(`Error fetching Products within Category: ${error.message}`)
        next(error);
      });
    })
    .catch(error => {
      console.log(`Error fetching category by Slug: ${error.message}`);
      next(error);
    });
  },
  indexView: (req, res) => {
    res.render("shop/category");
  },
  create: (req, res, next) => {
    let catParams = {
      slug: req.body.slug,
      category: req.body.category,
      description: req.body.description
    };

    Category.create(catParams)
      .then(category => {
        res.locals.redirect = "/shop";
        next();
      })
      .catch(error => {
        console.log(`Error saving category: ${error.message}`);
        next(error);
      })
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
}