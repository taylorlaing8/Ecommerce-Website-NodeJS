"use strict";

const Image = require("../models/image"),
  httpStatus = require("http-status-codes");

module.exports = {
    upload: (req, res) => {
        let imgParams = {
            title: req.body.title,
            alt: req.body.alt,
            url: req.body.url
        };

        Image.create(imgParams)
        .then(image => {
            res.json({
                status: httpStatus.OK,
            });
        })
        .catch(error => {
            console.log(`Error uploading image: ${error.message}`);
            res.json({
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            })
        })
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}