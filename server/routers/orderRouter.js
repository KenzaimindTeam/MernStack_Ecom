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
    const PAGE_SIZE = 5;
    const page = parseInt(req.query.page || "0");
    const total = await Order.countDocuments({});

    const token = req.cookies;

    const orders = await Order.find({})
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    console.log("all orders....." + orders); //here all users...

    res.json({ totalPages: Math.ceil(total / PAGE_SIZE), orders });
    // console.log(users);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.get("/createOrder/:id", async (req, res) => {
  console.log("get");
});

router.get("/ordersLists", authUser, async (req, res) => {
  try {
    // const token = req.cookies;
    // console.log(token);

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
    // req.body.order.user = req.profile;
    //    req.user=req.profile
    // console.log("000000000000" + profile);
    const { amount, products, address } = req.body;
    console.log(amount + products + address);
    const order = new Order({amount, products, address, user});
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

    // const {
    //   address,pincode,amount
    // } = req.body;

    // if (
    //   !address ||
    //   !pincode ||
    //   !amount

    // ) {
    //   return res
    //     .status(400)
    //     .json({ errorMessage: "Please fill out all the fields" });
    // }

    // const newOrder = new Order({
    //   address,
    //   pincode,
    //   totalamount,

    //   quantity,
    //  user:req.user,
    //   merchant: req.merchant,
    // });
    // const savedOrder = await newOrder.save();

    // res.json(savedOrder);
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

module.exports = router;
