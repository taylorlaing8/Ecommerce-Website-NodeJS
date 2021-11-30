"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    recentSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        product: {
            type: Array,
            required: true
        }
    });

module.exports = mongoose.model("Recent", recentSchema, 'cRecentlyViewed');