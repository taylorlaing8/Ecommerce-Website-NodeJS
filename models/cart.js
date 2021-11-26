"use strict";

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    cartSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        items: [{ 
            type: Schema.Types.ObjectId, 
            ref: "Product" 
        }],
        lineItems: { // Line items (total, subtotal, tax, discounts, etc.)
            type: {
                subtotal: {
                    type: Number,
                    required: true
                },
                tax: {
                    type: Number
                },
                discount: {
                    type: Number,
                },
                total: {
                    type: Number
                }
            }
        }
    });

module.exports = mongoose.model("Cart", cartSchema, 'cCarts');