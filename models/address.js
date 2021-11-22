"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    addressSchema = new Schema({
        address_1: {
            type: String,
            trim: true
        },
        address_2: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        zipCode: {
            type: Number,
            min: [10000, "Zip code too short"],
            max: [99999, "Zip code too long"]
        },
        country: {
            type: String,
            trim: true
        }
    });

module.exports = mongoose.model("Address", addressSchema, 'cAddress');