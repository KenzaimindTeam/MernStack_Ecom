const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema(
  {
    productmame: { type: String, required: true },
    quantity: { type: String, required: true },
    cost: { type: String, required: true },
    offer: { type: String },
    totalamount: { type: String, required: true },
    Pimage: { type: String },
    user: { type: ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
