const mongoose = require("mongoose");
const Product = require('./product');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },

  details: {
    type: String
  },

  categoryID: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },

  subCategories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }
  ]

});

module.exports = mongoose.model("Category", categorySchema);
