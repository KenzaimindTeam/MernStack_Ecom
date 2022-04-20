const router = require("express").Router();
const Merchant = require("../models/merchantModel");
var nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const authMerchant = require("../middleware/authMerchant.js");

const express = require("express");
const path = require("path");
const app = express();

const { Console } = require("console");
//sendTextMessage
/*const client = require("twilio")("", "");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: "",
    },
  })
);
`-`; */

router.post("/", async (req, res) => {
  console.log("merchant router");
});

router.get("/merchantProfile", authMerchant, async (req, res) => {
  try {
    const token = req.cookies.token;

    // const token = req.cookies;

    console.log(req.token);

    console.log("TOKEN................." + token);

    console.log("merchanttttID................" + req.merchant); //here particular merchant id is retrieved

    const merchants = await Merchant.findById({ _id: req.merchant });
    console.log("id.............." + req.merchant);

    console.log(merchants); //here all merchants...
    res.json(merchants);
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

router.post("/change-password/:id", authMerchant, async (req, res) => {
  const oldPassword = req.body.oldpassword;
  const newPassword = req.body.newpassword;
  const passwordVerify = req.body.passwordVerify;
  const merchantId = req.merchant;

  const existingMerchant = await Merchant.findById({ _id: req.merchant });

  const correctPassword = await bcrypt.compare(
    oldPassword,
    existingMerchant.passwordHash
  );

  if (!correctPassword)
    return res.status(401).json({
      errorMessage: "Old Password is incorrect.",
    });

  console.log("--------------new password" + newPassword);
  if (newPassword !== passwordVerify)
    return res.status(400).json({ errorMessage: "password do not match" });

  Merchant.findOne({ _id: req.merchant })
    .then((merchant) => {
      console.log("Merchant>----------------" + merchant);
      if (!merchant) {
        return res.status(422).json({ errorMessage: "no merchant detected" });
      }

      var pwdExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
      if (!pwdExp.test(newPassword))
        return res.status(400).json({
          errorMessage:
            "enter a password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter",
        });

      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        merchant.passwordHash = hashedpassword;
        console.log("hashedpassword  " + hashedpassword);
        merchant.resetToken = undefined;
        merchant.expireToken = undefined;
        merchant.save().then((savedMerchant) => {
          return res.json({ message: "password updated successfully" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/merchantRegister", async (req, res) => {
  console.log(req.body);

  try {
    const {
      shopid,
      shopname,
      firstname,
      lastname,
      password,
      email,
      mobno,

      address,
      street,
      city,
      state,
      zipcode,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !address ||
      !email ||
      !mobno ||
      !password ||
      !shopid ||
      !shopname ||
      !street ||
      !state ||
      !city ||
      !zipcode
    ) {
      return res.status(400).json({
        errorMessage: "please enter all required field",
      });
    }

    var emailRegex =
      /^(?=[^@]*[A-Za-z])([a-zA-Z0-9])(([a-zA-Z0-9])*([\._-])?([a-zA-Z0-9]))*@(([a-zA-Z0-9\-])+(\.))+([a-zA-Z]{2,4})+$/i;
    var valid = emailRegex.test(email);
    if (!valid)
      return res.status(400).json({
        errorMessage: "please enter valid email",
      });

    var nameExp = /^[A-Za-z]*$/;
    if (!nameExp.test(firstname))
      return res.status(400).json({
        errorMessage: "please enter text only",
      });

    var lnameExp = /^[A-Za-z]*$/;
    if (!lnameExp.test(lastname))
      return res.status(400).json({
        errorMessage: "please enter correct last name",
      });

    var phoneExp = /^[0-9]*$/;
    if (!phoneExp.test(mobno))
      return res.status(400).json({
        errorMessage: "please enter 10 digit number",
      });

    //var pwdExp = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    var pwdExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!pwdExp.test(password))
      return res.status(400).json({
        errorMessage:
          "enter a password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter",
      });

    if (firstname.length < 3)
      return res.status(400).json({
        errorMessage: "please enter min 3 characters long name",
      });

    if (mobno.length < 10 || mobno.length > 10)
      return res.status(400).json({
        errorMessage: "please enter correct Phone number",
      });

    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "please enter password atleast 6 characters",
      });

    const existingMerchant = await Merchant.findOne({ email });
    console.log(existingMerchant);
    if (existingMerchant)
      return res.status(400).json({
        errorMessage: "An account with this email already exists",
      });
    const existingMerchantt = await Merchant.findOne({ mobno });
    console.log(existingMerchantt);

    if (existingMerchantt)
      return res.status(400).json({
        errorMessage: "An account with this Phone number already exists",
      });
    //hash the password

    // if (!profileImg)
    //   return res.status(400).json({
    //     errorMessage: "upload an Image",
    //   });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newMerchant = new Merchant({
      shopid,
      shopname,
      firstname,
      lastname,
      mobno,
      email,
      passwordHash,
      address,
      street,
      city,
      state,
      zipcode,
      merchant: req.token,
    });

    const savedMerchant = await newMerchant.save();

    //create a JWT token

    const token = jwt.sign(
      {
        id: savedMerchant._id,
      },
      process.env.JWT_SECRET
    );
    console.log("merchant" + token);

    res.cookie("token", token, { httpOnly: true }).send();
  } catch (err) {
    console.log(err);

    res.status(500).send();
  }
});

router.post("/merchantLogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    

    // validation

    if (!email || !password)
      return res.status(400).json({
        errorMessage: "Please enter all required fields.",
      });

    // get merchant account

    const existingMerchant = await Merchant.findOne({ email });

    if (!existingMerchant)
      return res.status(401).json({
        errorMessage: "Wrong email or password,please register.",
      });

    const correctPassword = await bcrypt.compare(
      password,
      existingMerchant.passwordHash
    );

    if (!correctPassword)
      return res.status(401).json({
        errorMessage: "Invalid merchantname/Password",
      });

    // create a JWT token

    const token = jwt.sign(
      {
        id: existingMerchant._id,
      },
      process.env.JWT_SECRET
    );
    console.log(token);
    res.cookie("token", token, { httpOnly: true }).send();
  } catch (err) {
    res.status(500).send();
  }
});

router.put("/merchantUpdate", authMerchant, async (req, res) => {
  try {
    console.log(
      "inside /id..................................................."
    );
    const {
      shopid,
      shopname,
      firstname,
      lastname,
      mobno,
      email,
      address,
      street,
      city,
      state,
      zipcode,
    } = req.body;

    console.log("firstname--------" + firstname);

    const merchantId = req.merchant;

    const originalMerchant = await Merchant.findById({ _id: req.merchant });

    console.log("------------merchantid is -----------" + merchantId);

    console.log("original merchant........." + originalMerchant);

    originalMerchant.shopid = shopid || originalMerchant.shopid;
    originalMerchant.shopname = shopname || originalMerchant.shopname;

    originalMerchant.firstname = firstname || originalMerchant.firstname;
    originalMerchant.lastname = lastname || originalMerchant.lastname;
    originalMerchant.mobno = mobno || originalMerchant.mobno;
    originalMerchant.address = address || originalMerchant.address;
    originalMerchant.street = street || originalMerchant.street;
    originalMerchant.city = city || originalMerchant.city;
    originalMerchant.email = email || originalMerchant.email;
    originalMerchant.mobno = mobno || originalMerchant.mobno;
    originalMerchant.state = state || originalMerchant.state;
    originalMerchant.zipcode = zipcode || originalMerchant.zipcode;

    console.log(
      "originalMerchant--------------------------------" +
        originalMerchant.firstname
    );

    var emailRegex =
      /^(?=[^@]*[A-Za-z])([a-zA-Z0-9])(([a-zA-Z0-9])*([\._-])?([a-zA-Z0-9]))*@(([a-zA-Z0-9\-])+(\.))+([a-zA-Z]{2,4})+$/i;
    var valid = emailRegex.test(originalMerchant.email);
    if (!valid)
      return res.status(400).json({
        errorMessage: "please enter valid email",
      });

    var nameExp = /^[A-Za-z]*$/;
    if (!nameExp.test(originalMerchant.firstname))
      return res.status(400).json({
        errorMessage: "please enter text only",
      });

    var lnameExp = /^[A-Za-z]*$/;
    if (!lnameExp.test(originalMerchant.lastname))
      return res.status(400).json({
        errorMessage: "please enter correct last name",
      });

    var phoneExp = /^[0-9]*$/;
    if (!phoneExp.test(originalMerchant.mobno))
      return res.status(400).json({
        errorMessage: "please enter 10 digit number",
      });

    if (originalMerchant.firstname.length < 3)
      return res.status(400).json({
        errorMessage: "please enter min 3 characters long name",
      });

    if (
      originalMerchant.mobno.length < 10 ||
      originalMerchant.mobno.length > 10
    )
      return res.status(400).json({
        errorMessage: "please enter correct Phone number",
      });

    const saveMerchant = await originalMerchant.save();
    // res.json(saveMerchant);
    console.log("saved Merchant  is " + saveMerchant);
    res.json({
      shopid: saveMerchant.shopid,
      shopname: saveMerchant.shopname,

      firstname: saveMerchant.firstname,
      lastname: saveMerchant.lastname,
      email: saveMerchant.email,
      mobno: saveMerchant.mobno,
      address: saveMerchant.address,
      street: saveMerchant.street,
      city: saveMerchant.city,
      state: saveMerchant.state,
      zipcode: saveMerchant.zipcode,
      // profileImg: saveMerchant.profileImg,
    });
    //validation
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

router.post("/send-email", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const token = buffer.toString("hex");

      Merchant.findOne({ email: req.body.email }).then((merchant) => {
        if (!merchant)
          return res.status(401).json({
            errorMessage: "this merchant does not exist..... .",
          });
        merchant.resetToken = token;
        console.log("reset token-----   " + token);
        console.log(`http://localhost:3000/reset/${token}`);

        merchant.expireToken = Date.now() + 3600000; //valid for one hour
        //sms sending
        function sendTextMessage() {
          client.messages
            .create({
              body: `welcome to snippet manager your link for reset password is http://localhost:3000/reset/${token}`,
              to: "+", //trial purposes only to verified numbers
              from: "+", //no
            })
            .then((message) =>
              console.log(
                `SMS sent successfully http://localhost:3000/reset/${token}`
              )
            )
            // here you can implement your fallback code
            .catch((error) => console.log(error));
        }
        sendTextMessage(token);
       

        merchant.save().then((result) => {
          transporter.sendMail({
            //  let transporter = nodemailer.createTransport({
            to: merchant.email,
            from: "smn.maneeramkandath@gmail.com",
            subject: "password reset",
            html: `<h1>Welcome to snippet manager password</h1>
            <p>You requested for reset password </p>,
            <h5>click in this link <a href="http://localhost:3000/reset/${token}">Link</a>  to reset password</h5>`,
          });
          // alert("check your email");
          res.json({ message: "check yor email" });
          console.log("check your email");
          //    res.status(400).json({
          //    errorMessage: "check ur email.",
          //  });
        });

       
      });
    });
  } catch (err) {
    console.log("errr...." + err.response.data);
    return res.json(null);
  }
});

//forgot password
router.post("/new-password/:id", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  //  const sentToken = req.cookies.token;
  console.log(newPassword);
  console.log(sentToken);

  Merchant.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((merchant) => {
      console.log(merchant);
      if (!merchant) {
        return res
          .status(422)
          .json({ errorMessage: "Try again session expired" });
      }

      var pwdExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
      if (!pwdExp.test(newPassword))
        return res.status(400).json({
          errorMessage:
            "enter a password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter",
        });

      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        merchant.passwordHash = hashedpassword;
        console.log("hashedpassword  " + hashedpassword);
        merchant.resetToken = undefined;
        merchant.expireToken = undefined;
        merchant.save().then((savedMerchant) => {
          return res.json({ message: "password updated successfully" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/merchantLoggedIn", (req, res) => {
  try {
    const token = req.cookies.token;
    console.log("token..............*****....." + token);

    if (!token) return res.json(null);

    const validatedMerchant = jwt.verify(token, process.env.JWT_SECRET);
    req.merchant = validatedMerchant.id;

    res.json(validatedMerchant.id);
    console.log(validatedMerchant);
  } catch (err) {
    return res.json(null);
  }
});

module.exports = router;
