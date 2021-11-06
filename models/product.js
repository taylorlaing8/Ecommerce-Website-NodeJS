"use strict";

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    productSchema = new Schema({
        sku: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category"
        },
        images: { // Array of Image objects 
            type: Array,
            required: true,
        }
    });

module.exports = mongoose.model("Product", productSchema, 'cProducts');
