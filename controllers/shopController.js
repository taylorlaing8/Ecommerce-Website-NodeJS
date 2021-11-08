"use strict";

const Product = require("../models/product"),
    Category = require("../models/category"),
    httpStatus = require("http-status-codes");
  
module.exports = {
    index: (req, res, next) => {
        Category.find({})
        .then(categories => {
            if (categories) {
                res.locals.categories = categories;
                next();
            } else {
                res.render("error/pageNoteFound");
            }
        })
        .catch(error => {
            console.log(`Error fetching shop: ${error.message}`);
            next(error);
        });
    },
    indexView: (req, res) => {
        res.render("shop/index");
    },

    filterCategory: (req, res, next) => {
        next();
    },
    filterCategoryView: (req, res) => {
        res.render("shop/category");
    }
}