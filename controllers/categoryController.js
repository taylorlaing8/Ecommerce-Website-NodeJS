"use strict";

const Category = require("../models/category"),
  httpStatus = require("http-status-codes"),
  Product = require("../models/product"),
  Image = require("../models/image"),
  path = require("path");

module.exports = {
  index: (req, res, next) => {
    let catSlug = req.params.slug;

    Category.findOne({ slug: catSlug }).populate('image')
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
    Category.find({}).populate('image')
      .then(categories => {
        res.locals.categories = categories;
        next();
      }).catch(err => {
        console.log(`Error retrieving categories: ${err.message}`);
        next(err);
      })
  },
  getThree: (req, res, next) => {
    Category.find({}).populate('image')
    .then(categories => {
      res.locals.topCategories = categories.slice(0, 3);
      next();
    }).catch(err => {
      console.log(`Error fetching top 3 categories: ${err}`);
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
  update: async (req, res, next) => {
    let catParams = {
      slug: req.body.slug,
      title: req.body.title,
      description: req.body.description
    };

    try {
      let category = await Category.findById(req.body.id);

      if (req.files && req.files.image) {
        let imgFile = req.files.image;
        let uploadPath = path.join(__dirname, "../public/img/category/") + category._id + '_category_image.jpg';

        if(category.image) await Image.findByIdAndDelete(category.image)
        let img = await Image.create({
          title: category.title + ' Category Image',
          alt: category.slug + '_category_image',
          url: '/img/category/' + category._id + '_category_image.jpg'
        })

        catParams.image = img._id;
        imgFile.mv(uploadPath, (err) => {
            if (err) req.flash("error", `Error uploading image: ${err.message}`);
        });
      }

      let updatedCategory = await Category.findByIdAndUpdate(category._id, {
        $set: catParams
      })
      req.flash("success", `Category Updated!`);
      res.locals.redirect = `/admin/category/${category.slug}`;
      res.locals.category = updatedCategory;
      next();

    } catch (err) {
      req.flash("error", `Error updating category: ${err.message}.`);
      res.locals.redirect = `/admin/category/${catParams.slug}`;
      next();
    }
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