"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    variationSchema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: Schema.Types.ObjectId, 
            ref: "VariationType" 
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
    });

module.exports = mongoose.model("Variation", variationSchema, 'cVariation');