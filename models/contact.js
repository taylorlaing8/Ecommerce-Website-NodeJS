"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    contactSchema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        subject: {
            type: String,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        }
    });

module.exports = mongoose.model("Contact", contactSchema, 'cContact');