"use strict";

module.exports = {
    index: (req, res) => {
        res.render("shop/index");
    },

    filterCategory: (req, res, next) => {
        next();
    },
    filterCategoryView: (req, res) => {
        res.render("shop/category");
    }
}