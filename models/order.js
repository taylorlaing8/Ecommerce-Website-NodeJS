"use strict"; 

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    orderItemSchema = new Schema({
    
    _id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    variations: [{ 
        type: String, 
        required: true,
    }],
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
});

orderItemSchema.methods.updateQuantity = function(newQuantity) {
    this.quantity = newQuantity;
}
orderItemSchema.virtual("extendedPrice").get(function () {
    return this.price * this.quantity;
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        default: new Date(),
        required: true
    },
    
    items: [{
        type: orderItemSchema,
        required: true
    }],
    paid: {
        type: Boolean,
        default: false
    },
    paymentId: {
        type: String
    },
    paymentDate: {
        type: Date
    }
});

orderSchema.virtual("total").get(function () {
    let total = 0;
    this.items.forEach(item => {
        total += item.extendedPrice;
    });
    return total;
});

orderSchema.methods.findItem = function (id) {
    let order = this;
    let item = null;
    item = order.items.find(item => item._id === id);
    return item;
};

orderSchema.methods.addItem = function (item) {
    let order = this;
    let existingItem = order.findItem(item._id);
    if (existingItem) {
        existingItem.updateQuantity(existingItem.quantity + 1);
    } else {
        order.items.push(item);
    }
};

orderSchema.methods.updateItemQuantity = function (id, quantity) {
    let order = this;
    let itemToUpdate = order.findItem(id);
    if (itemToUpdate) {
        itemToUpdate.updateQuantity(quantity);
    }
};

orderSchema.methods.removeItem = function (id) {
    let order = this;
    order.items = order.items.filter(item => item._id !== id);
};


module.exports = mongoose.model("Order", orderSchema, 'cOrders');