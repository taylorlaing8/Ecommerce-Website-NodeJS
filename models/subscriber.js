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
            required: true,
        },
        subscribeDate: {
            type: Date
        },
        unsubscribeDate: {
            type: Date
        }
    });

module.exports = mongoose.model("Subscriber", subscriberSchema, 'cSubscribers');
