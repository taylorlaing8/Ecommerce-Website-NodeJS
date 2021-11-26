"use strict";

const Image = require("../models/image"),
  httpStatus = require("http-status-codes");

module.exports = {
    getAll: (req, res, next) => {
        Image.find({})
        .then(images => {
            res.locals.images = images;
            next();
        }).catch(err => {
            console.log(`Error retrieving images: ${err.message}`);
            next(err);
        })
    },
    upload: (req, res, next) => {
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
    update: (req, res, next) => {

    },
    remove: (req, res, next) => {

    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}