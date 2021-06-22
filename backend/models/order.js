const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    //to keep the products history
    products: [
         {
          type: Object,
          required: true
        }

    ],

    total: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model('Order', orderSchema);