"use strict";

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    Subscriber = require("./subscriber"),
    bcrypt = require("bcrypt"),
    userSchema = new Schema(
        {
            name: {
                first: {
                    type: String,
                    trim: true
                },
                last: {
                    type: String,
                    trim: true
                }
            },
            email: {
                type: String,
                required: true,
                lowercase: true,
                unique: true
            },
            address: {
                address_1: {
                    type: String,
                    trim: true
                },
                address_2: {
                    type: String,
                    trim: true
                },
                city: {
                    type: String,
                    trim: true
                },
                state: {
                    type: String,
                    trim: true
                },
                zipCode: {
                    type: Number,
                    min: [10000, "Zip code too short"],
                    max: [99999, "Zip code too long"]
                },
                country: {
                    type: String,
                    trim: true
                }
            },
            account: { // Two options: 'admin', 'user'
                type: String,
                trim: true,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            profileImage: {
                type: Schema.Types.ObjectId,
                ref: "Image"
            },
            subscribedAccount: {
                type: Schema.Types.ObjectId,
                ref: "Subscriber"
            }
        },
        {
            timestamps: true
        }
    );

userSchema.virtual("fullName").get(function () {
    return `${this.name.first} ${this.name.last}`;
});

// Check to see if there is a matching subscriber account before saving the user account
// If so, associate the subscribed account with the user
userSchema.pre("save", function (next) {
    let user = this;
    if (user.subscribedAccount === undefined) {
        Subscriber.findOne({
            email: user.email
        })
            .then(subscriber => {
                user.subscribedAccount = subscriber;
                next();
            })
            .catch(error => {
                console.log(`Error in connecting subscriber:${error.message}`);
                next(error);
            });
    } else {
        next();
    }
});

// Hash the user password using bcrypt before saving.

// ************************************ //
//  THIS WILL CHANGE TO NOT USE BCRYPT  //
// ************************************ //
userSchema.pre("save", function (next) {
    let user = this;
    bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(error => {
            console.log(`Error in hashing password: ${error.message}`);
            next(error);
        });
});

// Instance method to compare entered password with stored hashed password
userSchema.methods.passwordComparison = function (inputPassword) {
    let user = this;
    return bcrypt.compare(inputPassword, user.password);
};

module.exports = mongoose.model("User", userSchema, 'cUsers');
