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
            password: body.password
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
            res.send("You are not authorized");
        }
    },
    index: (req, res) => {
        res.render("account/index");
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
            userParams = {};

        // General Settings Update
        if(req.params.type == 'general') {
            userParams = {
                name: {
                    first: req.body.fName || currentUser.name.first,
                    last: req.body.lName || currentUser.name.last
                },
                email: req.body.email || currentUser.email,
                // profileImage: req.body.profileImage,
            };
        }
        // Address Settings Update
        else if(req.params.type == 'address') {

        }

        // Update User
        User.findByIdAndUpdate(currentUser, {
            $set: userParams
        }).then(user => {
            req.flash("success", `User Account Updated!`);
            res.locals.redirect = "/account";
            res.locals.currentUser = user;
            next();
        }).catch(error => {
            req.flash("error", `Error updating user: ${error.message}.`);
            res.locals.redirect = "/account";
            next();
        })
    },
    authenticate: passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Login failed: Check that you are using the correct username or password.",
        successRedirect: "/"
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
    verifyAdmin: (req, res, next) => {
        if (req.user && req.user.admin == true) {
            next();
        } else {
            res.send("You are not authorized");
        }
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
}
