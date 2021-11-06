"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    reviewSchema = new Schema({
        rating: {
            type: Number,
            min: 0,
            max: 5,
            required: true
        },
        title: {
            type: String,
            trim: true
        },
        body: {
            type: String
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    });

module.exports = mongoose.model("Review", reviewSchema, 'cReviews');