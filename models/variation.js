"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    variationSchema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            trim: true
        },
    });

module.exports = mongoose.model("Variation", variationSchema, 'cVariation');