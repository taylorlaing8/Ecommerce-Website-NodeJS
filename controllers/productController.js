"use strict";

const Product = require("../models/product"),
    Image = require("../models/image"),
    path = require("path"),
    Category = require("../models/category"),
    Variation = require("../models/variation"),
    httpStatus = require("http-status-codes");

module.exports = {
    index: (req, res, next) => {
        let prodSlug = req.params.slug;
        Product.findOne({ slug: prodSlug }).populate('category').populate('images').populate('variations')
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
    adminIndexView: (req, res) => {
        if (!res.locals.product) res.locals.product = null;
        res.render("admin/product/index");
    },
    getAll: (req, res, next) => {
        Product.find({}).populate('variations').populate('category').populate('images')
        .then(products => {
            res.locals.products = products;
            next();
        }).catch(err => {
            console.log(`Error retrieving products: ${err.message}`);
            next(err);
        })
    },
    getThree: (req, res, next) => {
        Product.find({}).populate('images')
        .then(products => {
          res.locals.products = products.slice(0, 3);
          next();
        }).catch(err => {
          console.log(`Error fetching top 3 products: ${err}`);
          next(err);
        })
      },
    create: (req, res, next) => {
        let prodParams = {
            slug: req.body.slug,
            sku: req.body.sku,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            variations: req.body.variations.flat(1),
            category: req.body.category,
        };

        Product.create(
            prodParams
        ).then(product => {
            req.flash("success", `Product Created Successfully!`);
            res.locals.redirect = `/admin/product/${product.slug}`;
            res.locals.product = product;
            next();
        })
        .catch(error => {
            console.log(error);
            req.flash("error", `Error creating product.`);
            res.locals.redirect = `/admin/product/create`;
            next();
        })
    },
    update: (req, res, next) => {
        let prodParams = {
            slug: req.body.slug,
            sku: req.body.sku,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            variations: req.body.variations.flat(1),
            category: req.body.category,
        };

        Product.findByIdAndUpdate(req.body.id, {
            $set: prodParams
        }).then(product => {
            req.flash("success", `Product Updated Successfully!`);
            res.locals.redirect = `/admin/product/${product.slug}`;
            res.locals.product = product;
            next();
        })
        .catch(error => {
            req.flash("error", `Error saving product.`);
            res.locals.redirect = `/admin/product/${prodParams.slug}`;
            next();
        })
    },
    addImage: async (req, res, next) => {     
        let product = res.locals.product;

        try {
            product = res.locals.product
            let imgIndex = product.images.length + 1;

            if(req.files.images.length >= 1) {
                req.files.images.forEach(async (imgFile, index) => {
                    imgIndex += index;

                    let uploadPath = `${path.join(__dirname, "../public/img/product/")}${product._id}-product_image-${Date.now()}${imgIndex}.jpg`;
                
                    let img = await Image.create({
                        title: product.title + ' Product Image',
                        alt: product.slug + '-product-image',
                        url: `/img/product/${product._id}-product_image-${Date.now()}${imgIndex}.jpg`
                    })

                    await imgFile.mv(uploadPath, (err) => {
                        if (err) console.log(`Error uploading image: ${error.message}`);
                    })

                    product = await Product.findByIdAndUpdate(product._id, {
                        $addToSet: { images: img._id }
                    })                
                })
            } else {
                let uploadPath = `${path.join(__dirname, "../public/img/product/")}${product._id}-product_image-${Date.now()}${imgIndex}.jpg`;
            
                let img = await Image.create({
                    title: product.title + ' Product Image',
                    alt: product.slug + '-product-image',
                    url: `/img/product/${product._id}-product_image-${Date.now()}${imgIndex}.jpg`
                })

                await req.files.images.mv(uploadPath, (err) => {
                    if (err) console.log(`Error uploading image: ${error.message}`);
                })

                product = await Product.findByIdAndUpdate(product._id, {
                    $addToSet: { images: img._id }
                })                
            }

            res.locals.product = product;
            res.locals.redirect = `/admin/product/${product.slug}#images`;
            next();
            
        } catch (error) {
            console.log(error);
            req.flash("error", "Error uploading image")
            res.locals.redirect = `/admin/product/${product.slug}#images`;
            next();
        }
    },
    removeImage: (req, res, next) => {
        let prodSlug = req.params.slug,
            imageId = req.params.imgId;
        
        Product.findOneAndUpdate(
            { slug: prodSlug },
            { $pull: { images: imageId } }
        ).then(product => {
            req.flash("success", `Product Image Removed Successfully!`);
            res.locals.redirect = `/admin/product/${product.slug}#images`;
            next();
        })
        .catch(error => {
            req.flash("error", `Error removing product image.`);
            res.locals.redirect = `/admin/product/${prodSlug}#images`;
            next();
        })
    },
    remove: (req, res, next) => {
        let prodSlug = req.params.slug;

        Product.findOneAndDelete({
            slug: prodSlug
        }).then(response => {
            req.flash("success", `Product Successfully Removed!`);
            res.locals.redirect = "/admin#products";
            next();
        })
        .catch(error => {
            req.flash("error", `Error removing product.`);
            res.locals.redirect = `/admin/product/${prodSlug}`;
            next();
        })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}