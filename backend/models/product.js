const mongoose = require("mongoose");

const Tag = require('./tag');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  desc: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  imageURL: {
    type: String
  },

  categoryID: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  subCategoryID: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },

  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag"
    }
  ]
});

productSchema.pre('save', async function () {
  await Tag.updateMany({ _id: { $in: this.tags } }, { $push: { products: this._id } });
});

productSchema.pre('deleteOne', { document: true }, async function () {
  await Tag.updateMany({ _id: this.tags }, { $pull: { products: this._id } });
});


module.exports = mongoose.model("Product", productSchema);
