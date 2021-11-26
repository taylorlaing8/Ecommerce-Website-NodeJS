"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    categorySchema = new Schema({
        slug: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        }
    });

module.exports = mongoose.model("Category", categorySchema, 'cCategories');