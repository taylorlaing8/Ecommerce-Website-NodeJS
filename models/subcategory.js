"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    subcategorySchema = new Schema({
        category: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Category"
        }
    });

module.exports = mongoose.model("Subcategory", subcategorySchema, 'cSubcategories');