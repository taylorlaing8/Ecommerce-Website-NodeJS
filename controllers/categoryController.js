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
          .then(products => {
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
  getAll: (req, res, next) => {
    Category.find({})
      .then(categories => {
        res.locals.categories = categories;
        next();
      }).catch(err => {
        console.log(`Error retrieving categories: ${err.message}`);
        next(err);
      })
  },
  create: (req, res, next) => {
    let catParams = {
      slug: req.body.slug,
      title: req.body.title,
      description: req.body.description
    };

    Category.create(catParams)
      .then(category => {
        req.flash("success", `Category Created Successfully!`);
        res.locals.redirect = `/admin/category/${category.slug}`;
        res.locals.category = category;
        next();
      })
      .catch(error => {
        req.flash("error", `Error creating category.`);
        res.locals.redirect = `/admin/category/${category.slug}`;
        next();
      })
  },
  update: (req, res, next) => {
    let catParams = {
      slug: req.body.slug,
      title: req.body.title,
      description: req.body.description
    };

    Category.findByIdAndUpdate(req.body.id, {
      $set: catParams
    }).then(category => {
      req.flash("success", `Category Updated Successfully!`);
      res.locals.redirect = `/admin/category/${category.slug}`;
      res.locals.category = category;
      next();
    })
      .catch(error => {
        req.flash("error", `Error saving category.`);
        res.locals.redirect = `/admin/category/${category.slug}`;
        next();
      })
  },
  remove: (req, res, next) => {
    let catSlug = req.params.slug;

    Category.findOne({
      slug: catSlug
    }).then(c => {
      Product.updateMany(
        { category: { $in: c._id } },
        { $set: { category: null } }
      ).then(() => {
        Category.findByIdAndDelete(c._id)
          .then(() => {
            req.flash("success", `Category Removed Successfully!`);
            res.locals.redirect = `/admin`;
            next();
          })
      })
    }).catch(err => {
      req.flash("error", `Error removing category.`);
      res.locals.redirect = `/admin/category/${catSlug}`;
      next();
    })
  },
  adminIndexView: (req, res) => {
    if (!res.locals.category) res.locals.category = null;
    res.render("admin/category/index");
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
}