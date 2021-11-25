"use strict";

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    productSchema = new Schema({
        slug: {
            type: String,
            required: true,
            unique: true
        },
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
        price: {
            type: Number,
            required: true
        },
        variations: [{ 
            type: Schema.Types.ObjectId, 
            required: true,
            ref: "Variation" 
        }],
        category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Category"
        },
        images: [{ 
            type: Schema.Types.ObjectId, 
            ref: "Image" 
        }]
    });

module.exports = mongoose.model("Product", productSchema, 'cProducts');
