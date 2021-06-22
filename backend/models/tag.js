const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },

  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});


tagSchema.pre('deleteOne', { document: true }, async function () {
  const Product = require('./product');
  await Product.updateMany({ _id: this.products }, { $pull: { tags: this._id } });

});

module.exports = mongoose.model("Tag", tagSchema);
