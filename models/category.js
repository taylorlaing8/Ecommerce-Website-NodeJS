"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    categorySchema = new Schema({
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true
        },
        image: {
            type: Schema.Types.ObjectId,
            ref: "Image"
        },
        description: {
            type: String
        }
    });

module.exports = mongoose.model("Category", categorySchema, 'cCategories');