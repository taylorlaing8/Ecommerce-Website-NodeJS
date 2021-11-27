"use strict";

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    subscriberSchema = new Schema({
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        subscribed: {
            type: Boolean,
            default: true,
            required: true,
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Subscriber", subscriberSchema, 'cSubscribers');
