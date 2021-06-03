'use strict';
// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const ProductSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

// create and export model
module.exports = mongoose.model("productModel", ProductSchema);
