"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    orderSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        status: { // 'placed', 'processing', 'shipped', 'delivered'
            type: String,
            required: true
        },
        cart: { // What cart placed the order to get the items and line items
            type: Schema.Types.ObjectId,
            ref: "Cart"
        }
    });

module.exports = mongoose.model("Order", orderSchema, 'cOrders');