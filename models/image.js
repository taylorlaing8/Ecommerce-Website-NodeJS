"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    imageSchema = new Schema({
        title: {
            type: String,
        },
        alt: {
            type: String
        },
        url: {
            type: String,
            required: true
        }
    });

module.exports = mongoose.model("Image", imageSchema, 'cImages');