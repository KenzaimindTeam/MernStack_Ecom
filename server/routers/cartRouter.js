const router = require("express").Router();
const express = require("express");
const path = require("path");
const app = express();
const jwt = require("jsonwebtoken");

const Merchant = require("../models/merchantModel");
const User = require("../models/userModel");
const authUser = require("../middleware/authUser.js");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const { db } = require("../models/cartModel");
const { ObjectId } = require("mongodb");

router.get("/items", authUser, async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    const products = await Cart.find({ user: req.user });

    //validation
    if (!productId)
      return res.status(400).json({
        errorMessage: "product id not given ..please contact developer",
      });

    res.json(products);
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

module.exports = router;
