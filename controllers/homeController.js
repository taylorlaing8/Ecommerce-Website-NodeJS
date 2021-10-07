"use strict";

exports.index = (req, res) => {
  res.render("index");
};

exports.about = (req, res) => {
  res.render("about");
};

exports.contact = (req, res, next) => {
  res.render("contact");
};

exports.shop = (req, res) => {
  res.render("shop");
};

exports.shopSingle = (req, res) => {
  res.render("shop-single");
};
