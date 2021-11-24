"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    variationTypeSchema = new Schema({
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

module.exports = mongoose.model("VariationType", variationTypeSchema, 'cVariationType');