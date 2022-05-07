const router = require("express").Router();
const Product = require("../models/productModel");

const User = require("../models/userModel");

const { Order, CartItem } = require("../models/orderModel");

const authUser = require("../middleware/authUser.js");

const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const express = require("express");
const path = require("path");
const app = express();

const { Console } = require("console");

const authMerchant = require("../middleware/authMerchant.js");

router.get("/allorders", async (req, res) => {
  try {
    const PAGE_SIZE = 6;
    const page = parseInt(req.query.page || "0");

    const total = await Order.countDocuments({});
    const orders = await Order.find({})
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    res.json({ totalPages: Math.ceil(total / PAGE_SIZE), orders });
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

router.get("/createOrder/:id", async (req, res) => {
  console.log("get");
  const orderId = req.params.id;
  console.log("orderId : " + orderId);
  const originalOrder = await Order.findById(orderId);
  const products = originalOrder.products;
  // res.json(products);

  // const ProductId = products.id;
  // console.log("Productid----------" + ProductId);
  const productId = products.id;
  const producTab = await Product.findById(products);
  Pimage = producTab.Pimage;
  console.log("Pimage ==========" + Pimage);
  // res.json(Pimage)
  // const newProducts = { ...req.body, Pimage };
  // products.push(producTab);

  res.json(products);
  console.log("products" + products);
});

router.put("/createOrder/:id", authMerchant, async (req, res) => {
  try {
    console.log("######In put create order backend#####");

    const { status } = req.body;
    const orderId = req.params.id;
    console.log("orderId : " + orderId);
    const originalOrder = await Order.findById(orderId);

    console.log(originalOrder);
    console.log(status);

    originalOrder.status = status || originalOrder.status;

    const saveOrder = await originalOrder.save();

    res.json({ status: status });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.get("/ordersLists", authUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user });
    console.log("orders list in backend" + orders);
    res.json(orders);
  } catch (err) {
    res.status(500).send();
  }
});
router.post("/createOrder/:id", authUser, async (req, res) => {
  try {
    console.log("######In create order backend#####");
    const token = req.cookies.token;
    console.log("token" + token);

    const user = req.user;

    const { amount, products, address } = req.body;

    console.log(amount + products + address);
    const order = new Order({ amount, products, address, user });
    // quantity=
    console.log("ORDerrrrrrrr" + order);
    order.save((error, values) => {
      if (error) {
        console.log(error);

        return res.status(400).json({
          error: errorHandler(error),
        });
      }
    });
    console.log(order);
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

module.exports = router;
