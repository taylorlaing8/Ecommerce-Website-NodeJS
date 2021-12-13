"use strict";

const { check, validationResult } = require("express-validator");
const Order = require("../models/order");
const User = require("../models/user"),
    Image = require("../models/image"),
    Address = require("../models/address"),
    passport = require("passport"),
    token = process.env.TOKEN || "cvtToken08$",
    jsonWebToken = require("jsonwebtoken"),
    path = require("path"),
    getUserParams = body => {
        return {
            name: {
                first: body.fname,
                last: body.lname
            },
            email: body.email,
        }
    }
module.exports = {
    verifyLoggedIn: (req, res, next) => {
        // res.send(req.originalUrl);
        if (req.user) {
            next();
        } else {
            res.redirect("/login");
        }
    },
    verifyAdmin: (req, res, next) => {
        if (req.user && req.user.admin == true) {
            next();
        } else {
            req.flash("error", "You are not authorized to access this resource.");
            res.redirect("/account");
        }
    },
    index: (req, res, next) => {
        let currentUser = req.user;

        User.findById(currentUser._id).populate('profileImage').populate('shipping_address')
        .then(user => {
            res.locals.currentUser = user;

            Order.find({
                user: user._id
            }).then(orders => {
                res.locals.orders = orders;
                next();
            })
        })
        .catch(err => {
            req.flash("error", "Error loading user account.");
            res.redirect("/account");
        })
    },
    getUser: (req, res, next) => {
        User.findById(req.params.id).populate('profileImage').populate('shipping_address')
        .then(user => {
            res.locals.user = user;
            next();
        })
        .catch(err => {
            req.flash("error", "Error loading user account.");
            res.redirect("/account");
        });
    },
    indexView: (req, res) => {
        res.render("account/index");
    },
    adminIndex: (req, res) => {
        res.render("admin/index");
    },
    login: (req, res) => {
        res.render("account/login");
    },
    create: (req, res, next) => {
        if (req.skip) next();
        let newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                res.locals.redirect = "/";
                passport.authenticate("local", {});
                next();
            } else {
                res.locals.redirect = "/login";
                req.flash("createAccountError", `Error creating account: ${error.message}.`);
                next();
            }
        });
    },
    toggleAdmin: (req, res, next) => {
        let userId = req.params.id,
            admin = req.params.admin == 0 ? true : false;

        User.findByIdAndUpdate(userId, {
            $set: { admin: admin }
        }).then(user => {
            req.flash("success", `User Account Updated!`);
            res.locals.redirect = "/admin#users";
            next();
        }).catch(err => {
            req.flash("error", `Error updating user: ${err.message}.`);
            res.locals.redirect = "/admin#users";
            next();
        });
    },
    updateGeneral: async (req, res, next) => {
        let currentUser = req.user,
            userParams = {
                name: {
                    first: req.body.fName || currentUser.name.first,
                    last: req.body.lName || currentUser.name.last
                },
                email: req.body.email || currentUser.email
            };

        if (req.files && req.files.image) {
            let imgFile = req.files.image;
            let uploadPath = path.join(__dirname, "../public/img/account/") + currentUser._id + '_profile_image.jpg';

            try {
                let pastImage = await Image.findOne({url: `/img/account/${currentUser._id}_profile_image.jpg`})
                if(currentUser.profileImage) {
                    await Image.findByIdAndDelete(currentUser.profileImage)
                }
                if(pastImage) {
                    await Image.findByIdAndDelete(pastImage._id);
                }
                
                let img = await Image.create({
                    title: currentUser.name.first + ' Profile Image',
                    alt: currentUser.name.first + '_profile_image',
                    url: '/img/account/' + currentUser._id + '_profile_image.jpg'
                })

                userParams.profileImage = img._id;
                imgFile.mv(uploadPath, (err) => {
                    if (err) req.flash("error", `Error uploading image: ${err.message}`);
                });

                let user = await User.findByIdAndUpdate(currentUser, {
                    $set: userParams
                })

                req.flash("success", `User Account Updated!`);
                res.locals.redirect = "/account";
                res.locals.currentUser = user;
                next();
            } catch (err) {
                req.flash("error", `Error updating user: ${err.message}.`);
                res.locals.redirect = "/account";
                next();
            }
        } else {
            try {
                let user = await User.findByIdAndUpdate(currentUser, {
                    $set: userParams
                })
                req.flash("success", `User Account Updated!`);
                res.locals.redirect = "/account";
                res.locals.currentUser = user;
                next();
            } catch (err) {
                req.flash("error", `Error updating user: ${err.message}.`);
                res.locals.redirect = "/account";
                next();
            }
        }
    },
    updateAddress: (req, res, next) => {
        let currentUser = req.user,
            address = {
                address_1: req.body.address1,
                address_2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipcode,
                country: req.body.country,
            };
        
        if(currentUser.shipping_address) {
            Address.findByIdAndUpdate(currentUser.shipping_address._id,
                { $set: address }
            ).then(address => {
                User.findByIdAndUpdate(currentUser, {
                    $set: { shipping_address: address }
                }).then(user => {
                    req.flash("success", `User Account Updated!`);
                    res.locals.redirect = "/account";
                    res.locals.currentUser = user;
                    next();
                })
            }).catch(error => {
                req.flash("error", `Error updating user: ${error.message}.`);
                res.locals.redirect = "/account";
                next();
            });
        } else {
            Address.create(address)
            .then(address => {
                User.findByIdAndUpdate(currentUser, {
                    $set: { shipping_address: address }
                }).then(user => {
                    req.flash("success", `User Account Updated!`);
                    res.locals.redirect = "/account";
                    res.locals.currentUser = user;
                    next();
                })
            }).catch(error => {
                req.flash("error", `Error updating user: ${error.message}.`);
                res.locals.redirect = "/account";
                next();
            });
        }
    },
    getAll: (req, res, next) => {
        User.find({}).populate('profileImage')
        .then(users => {
            res.locals.users = users;
            next();
        }).catch(err => {
            req.flash("error", "Error retrieving users.");
            console.log(`Error retrieving users: ${err.message}`);
            next(err);
        });
    },
    authenticate: passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Login failed: Check that you are using the correct username or password.",
        successReturnToOrRedirect: "/",
        successFlash: "Logged in!"
    }),
    verifyJWT: (req, res, next) => {
        let token = req.headers.token;
        if (token) {
            jsonWebToken.verify(
                token,
                "secret_encoding_passphrase",
                (errors, payload) => {
                    if (payload) {
                        User.findById(payload.data).then(user => {
                            if (user) {
                                next();
                            } else {
                                res.status(httpStatus.FORBIDDEN).json({
                                    error: true,
                                    message: "No User account found."
                                });
                            }
                        });
                    } else {
                        res.status(httpStatus.UNAUTHORIZED).json({
                            error: true,
                            message: "Cannot verify API Token."
                        });
                    }
                }
            );
        } else {
            res.status(httpStatus.UNAUTHORIZED).json({
                error: true,
                message: "Provide Token"
            })
        }
    },

    validate: async (req, res, next) => {
        await check("email").normalizeEmail({
            all_lowercase: true
        }).trim().run(req);
        await check("email", "Email is invalid").isEmail().run(req);
        await check("password", "Password cannot be empty").notEmpty().run(req);

        const error = validationResult(req);
        if (!error.isEmpty()) {
            let messages = error.array().map(e => e.msg);
            req.skip = true;
            req.flash("error", messages.join(" and "));
            res.locals.redirect = "/account/login";
            next();
        } else {
            next();
        }

    },
    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    },
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
        .then(() => {
            req.flash("success", "User Account Removed!")
            res.locals.redirect = "/admin#users";
            next();
        })
        .catch(error => {
            req.flash("error", "Error removing user account.");
            res.locals.redirect = "/admin#users";
            next();
        });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}
