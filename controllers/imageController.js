"use strict";

const Image = require("../models/image"),
    User = require("../models/user"),
    Product = require("../models/product"),
    httpStatus = require("http-status-codes"),
    path = require("path"),
    fs = require('fs');

module.exports = {
    getOne: (req, res, next) => {
        let imgId = req.params.id;

        Image.findById(imgId)
        .then(image => {
            res.locals.image = image;
            next();
        }).catch(error => {
            req.flash("error", "Error fetching image.");
            next();
        });
    },
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
    adminIndex: (req, res) => {
        res.render("admin/image/index");
    },
    update: (req, res, next) => {
        let imgId = req.body.id,
            imgParams = {
                title: req.body.title,
                alt: req.body.alt
            };

        Image.findByIdAndUpdate(imgId,
            {$set: imgParams}
        ).then(image => {
            res.locals.image = image;
            req.flash("success", "Image Updated Successfully!");
            res.locals.redirect = `/admin/image/${image._id}`;
            next();
        }).catch(error => {
            req.flash("error", "Error updating image");
            res.locals.redirect = `/admin/image/${imgId}`;
            next();
        })
    },
    remove: async (req, res, next) => {
        let imgId = req.params.id;
        
        try {
            let image = await Image.findById(imgId);
            let imageUrl = image.url;
            
            await Product.updateMany(
                { images: { $in: imgId }},
                { $pull: { images: imgId }}
            );

            await User.updateMany(
                { profileImage: imgId },
                { $unset: { profileImage: "" }}
            );

            let imgPath = `${path.join(__dirname, "../public/")}${imageUrl}`;
            await fs.unlinkSync(imgPath);

            await Image.findByIdAndDelete(imgId);

            req.flash("success", `Image Removed Successfully!`);
            res.locals.redirect = `/admin#images`;
            next();

        } catch (error) {
            req.flash("error", "Error removing image.");
            res.locals.redirect = `/admin/image/${imgId}`;
            next();
        }
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}