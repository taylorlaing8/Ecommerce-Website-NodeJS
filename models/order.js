"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    orderSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        shippingAddress: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Address"
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
        },
        status: { // 'placed', 'processing', 'shipped', 'delivered'
            type: String,
            required: true
        },
        cart: { // What cart placed the order
            type: Schema.Types.ObjectId,
            ref: "Cart"
        }
    });

module.exports = mongoose.model("Order", orderSchema, 'cOrders');