const router = require("express").Router();
const Product = require("../models/productModel");

const authMerchant = require("../middleware/authMerchant.js");
const Merchant = require("../models/merchantModel");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const express = require("express");
const path = require("path");
const app = express();

const { Console } = require("console");

router.get("/productsLists", authMerchant, async (req, res) => {
  try {
    // const token = req.cookies;
    // console.log(token);

    const products = await Product.find({ merchant: req.merchant });
    res.json(products);
  } catch (err) {
    res.status(500).send();
  }
});
router.get("/productsAll", async (req, res) => {
  try {
    // const token = req.cookies;
    // console.log(token);
    const PAGE_SIZE = 8;
    const page = parseInt(req.query.page || "0");
    const total = await Product.countDocuments({});
    const products = await Product.find({})
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    res.json({ totalPages: Math.ceil(total / PAGE_SIZE), products });
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

router.get("/:id", authMerchant, async (req, res) => {
  try {
    // const token = req.cookies;
    const productId = req.params.id;
    // const products = await Product.find({ merchant: req.merchant });
    // const products = await Product.findById({ id: req.product });

    console.log(
      "id.................................................................................." +

      productId
=======
        productId
>>>>>>> c8de4655d3527be9f4c7d497510cdd3a247d43be
    );
    const originalProduct = await Product.findById(productId);

    // const producoriginalProductts = await Product.find({ _id: req.product });
    res.json(originalProduct);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.post("/createProducts", authMerchant, async (req, res) => {
  try {
    console.log("in create products");

    const {
      catgname,
      machname,
      cost,
      weight,
      quantity,
      offer,
      totalamount,
      Pimage,
    } = req.body;

    if (
      !catgname ||
      !machname ||
      !cost ||
      !weight ||
      !quantity ||
      !totalamount
    ) {
      return res
        .status(400)
        .json({ errorMessage: "Please fill out all the fields" });
    }

    if (!Pimage)
      return res.status(400).json({
        errorMessage: "upload an Image",
      });

    var imagePath = " ";

    const imagee = Pimage.split("fakepath\\");
    console.log(imagee[1]);

    imagePath = imagee[1];

    console.log(imagePath);

<<<<<<< HEAD
    var nameExp = /^[A-Za-z]*$/;
    if (!nameExp.test(catgname))
      return res.status(400).json({
        errorMessage: "please enter alphabets only in category name",
      });

    var MnameExp = /^[A-Za-z]*$/;
    if (!MnameExp.test(machname))
      return res.status(400).json({
        errorMessage: "please enter alphabets only in Machine name",
      });

    var CExp = /^[0-9]{2,40}$/;
    if (!CExp.test(cost))
      return res.status(400).json({
        errorMessage: "please enter numeric only ",
      });

    var QExp = /^[0-9]{1,20}$/;
    if (!QExp.test(quantity))
      return res.status(400).json({
        errorMessage: "please enter numeric only ",
      });

    var WExp = /^[0-9]{1,20}$/;
    if (!WExp.test(weight))
      return res.status(400).json({
        errorMessage: "please enter numeric only ",
      });

    var OExp = /^[0-9]{2,40}$/;
    if (!OExp.test(offer))
      return res.status(400).json({
        errorMessage: "please enter numeric only ",
      });

    var TExp = /^[0-9]{1,20}$/;
    if (!TExp.test(totalamount))
      return res.status(400).json({
        errorMessage: "please enter numeric only ",
      });


=======
>>>>>>> c8de4655d3527be9f4c7d497510cdd3a247d43be
    const newProduct = new Product({
      catgname,
      machname,
      cost,
      weight,
      quantity,
      offer,
      totalamount,
      Pimage: imagePath,
      merchant: req.merchant,
    });
    const savedProduct = await newProduct.save();

    res.json(savedProduct);
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

router.put("/:id", authMerchant, async (req, res) => {
  try {
    console.log("inside id...................................................");

    const { catgname, machname, cost, weight, quantity, offer, totalamount } =
      req.body;

    const productId = req.params.id;

    //const productId = req.product;
    console.log(productId);

    const originalProduct = await Product.findById(productId);

    // const originalProduct = await Product.findById({ productId });

    console.log("------------productid is -----------" + productId);

    // const originalUser = await User.findById(userId);

    console.log("original product........." + originalProduct);

    originalProduct.catgname = catgname || originalProduct.catgname;
    console.log("ist name     -----------" + catgname);
    originalProduct.machname = machname || originalProduct.machname;
    originalProduct.cost = cost || originalProduct.cost;
    originalProduct.quantity = quantity || originalProduct.quantity;
    originalProduct.weight = weight || originalProduct.weight;
    originalProduct.offer = offer || originalProduct.offer;
    originalProduct.totalamount = totalamount || originalProduct.totalamount;

    console.log(
      "totalamount--------------------------------" +
<<<<<<< HEAD
      originalProduct.totalamount
=======
        originalProduct.totalamount
>>>>>>> c8de4655d3527be9f4c7d497510cdd3a247d43be
    );

    var nameExp = /^[A-Za-z]*$/;
    if (!nameExp.test(originalProduct.catgname))
      return res.status(400).json({
        errorMessage: "please enter text only",
      });
<<<<<<< HEAD
    var MnameExp = /^[A-Za-z]*$/;
    if (!MnameExp.test(originalProduct.machname))
      return res.status(400).json({
        errorMessage: "please enter text only",
      });

    var QExp = /^[0-9]{1,20}$/;
    if (!QExp.test(originalProduct.quantity))
      return res.status(400).json({
        errorMessage: "please enter quantity in numeric",
=======

    var phoneExp = /^[0-9]*$/;
    if (!phoneExp.test(originalProduct.quantity))
      return res.status(400).json({
        errorMessage: "please enter 10 digit number",
>>>>>>> c8de4655d3527be9f4c7d497510cdd3a247d43be
      });

    if (originalProduct.machname.length < 3)
      return res.status(400).json({
        errorMessage: "please enter min 3 characters long name",
      });

    if (originalProduct.weight > 100 && originalProduct.weight < 1)
      return res.status(400).json({
        errorMessage: "please enter weight between  1 and 100",
      });

    if (originalProduct.quantity > 400 && originalProduct.quantity < 0)
      return res.status(400).json({
        errorMessage: "please enter quantity between  1 and 400",
      });

    // if (originalProduct.phone.length < 10 || phone.length > 10)
    //   return res.status(400).json({
    //     errorMessage: "please enter correct Phone number",
    //   });
    //profileImg = image;
    // if (!originalUser.firstName || !originalUser.lastName || !originalUser.phone || !originalUser.email) {
    //   return res.status(400).json({
    //     errorMessage: "please enter all required field",
    //   });
    // }
    const saveProduct = await originalProduct.save();
    // res.json(saveUser);
    console.log("saved product  is " + saveProduct);
    res.json({
      catgname: saveProduct.catgname,
      machname: saveProduct.machname,
      cost: saveProduct.cost,
      quantity: saveProduct.quantity,
      weight: saveProduct.weight,
      offer: saveProduct.offer,
      totalamount: saveProduct.totalamount,
      // profileImg: saveUser.profileImg,
    });
    //validation
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

router.delete("/:id", authMerchant, async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    //validation
    if (!productId)
      return res.status(400).json({
        errorMessage: "product id not given ..please contact developer",
      });

    const existingProduct = await Product.findById(productId);

    //validation
    if (!existingProduct)
      return res
        .status(400)
        .json({ errorMessage: "no Product with id was found" });

    if (existingProduct.merchant.toString() !== req.merchant)
      return res.status(401).json({ errorMessage: "Unauthorized" });

    await existingProduct.delete();

    res.json(existingProduct);
  } catch (err) {
    res.status(500).send();
    console.error(err);
  }
});
router.post("/search-products", (req, res) => {
  try {
    let productPattern = new RegExp("^" + req.body.query);
    Product.find({ machname: { $regex: productPattern } })
      .select("machname")
      .then((product) => {
        res.json({ product });
      });
  } catch (err) {
    return res.json(null);
    console.log(err);
  }
});

module.exports = router;
