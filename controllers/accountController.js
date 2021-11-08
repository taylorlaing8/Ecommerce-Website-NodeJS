"use strict";

const { check, validationResult } = require("express-validator");
const User = require("../models/user"),
    passport = require("passport"),
    token = process.env.TOKEN || "cvtToken08$",
    jsonWebToken = require("jsonwebtoken"),
    getUserParams = body => {
        return {
            name: {
                first: body.fname,
                last: body.lname
            },
            email: body.email,
            account: 'user', // Two options: 'admin', 'user'
            password: body.password
        }
    }
module.exports = {
    index: (req, res, next) => {
        let currentUser = req.user;
        if (currentUser) {
            User.findById(currentUser)
                .then(user => {
                    res.locals.user = user;
                    res.locals.redirect = "/";
                    next();
                })
                .catch(error => {
                    console.log(`Error accessing user account: ${error.message}`);
                    next(error);
                })
        } else {
            res.locals.redirect = "/account/login";
            next();
        }
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
                next();
            } else {
                req.flash("createAccountError", `Failed to create user account because: ${error.message}.`);
                res.locals.redirect = "/account/login";
                next();
            }
        });
    },
    edit: (req, res, next) => {
        let currentUser = req.user;
        if (currentUser) {
            User.findById(currentUser)
                .then(user => {
                    res.locals.user = user;
                    res.render("/account/edit")
                    next();
                })
                .catch(error => {
                    console.log(`Error fetching user by ID: ${error.message}`);
                    next(error);
                })
        } else {
            res.locals.redirect = "/";
            next();
        }
    },
    update: (req, res, next) => {
        let currentUser = req.user,
            userParams = {
                name: {
                    first: req.body.first,
                    last: req.body.last
                },
                email: req.body.email,
                address: {
                    address_1: req.body.address1,
                    address_2: req.body.address2,
                    city: req.body.city,
                    state: req.body.state,
                    zipCode: req.body.zipcode,
                    country: req.body.country
                },
                account: req.body.accountType,
                password: req.body.password,
                profileImage: req.body.profileImage,
            };

        if (currentUser) {
            User.findByIdAndUpdate(currentUser, {
                $set: userParams
            })
                .then(user => {
                    res.locals.redirect = "/";
                    res.locals.user = user;
                    next();
                }).catch(error => {
                    console.log(`Error updating user: ${error.message}`);
                    next(error);
                })
        } else {
            res.locals.redirect = "/";
            next();
        }
    },
    authenticate: passport.authenticate("local", {
        failureRedirect: "/account/login",
        failureFlash: "Failed to login.",
        successRedirect: "/",
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
        let currentUser = req.user;
        if (currentUser) {
            User.findByIdAndRemove(currentUser)
                .then(() => {
                    res.locals.redirect = "/";
                    next();
                })
                .catch(error => {
                    console.log(`Error deleting user by ID: ${error.message}`);
                    next();
                });
        } else {
            res.locals.redirect = "/accoun/login";
            next();
        }
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}
