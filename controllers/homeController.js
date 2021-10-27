"use strict";

exports.index = (req, res) => {
  res.render("index");
};

exports.about = (req, res) => {
  res.render("about");
};

exports.contact = (req, res, next) => {
  res.render("contact/index");
};

exports.shop = (req, res) => {
  res.render("shop/index");
};

exports.shopSingle = (req, res) => {
  res.render("shop/product");
};

exports.search = (req, res) => {
  res.render("search");
}

exports.account = (req, res) => {
  res.render("profile/index");
}

exports.cart = (req, res) => {
  res.render("cart/index");
}