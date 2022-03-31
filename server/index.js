const express = require("express");
const mongoose = require("mongoose");

const multer = require("multer");
const path = require("path");

const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

var nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
dotenv.config();

//setup express server

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: "./public/uploads/",

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jfif"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed"));
    }
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

//setup routers
app.use("/authMerchant", require("./routers/merchantRouter"));
app.use("/auth", require("./routers/adminRouter"));
app.use("/product", require("./routers/productRouter"));
app.use("/category", require("./routers/categoryRouter"));
app.use("/authUser", require("./routers/userRouter"));
app.use("/authOrder", require("./routers/orderRouter"));
app.use("/cart", require("./routers/cartRouter"));

app.use("/uploads", express.static("public/uploads"));

app.post("/upload", upload.single("Pimage"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(
      "upload................................................................................"
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/uploads/:id", upload.single("Pimage"), async (req, res) => {
  try {
    console.log(req.body);
    //  console.log(profileImg.image);
  } catch (err) {
    console.log(err);
  }
});

//connect to mongoDb

mongoose.connect(
  process.env.MDB_CONNECT_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) return console.error(err);
    console.log("connected to MongoDB");
  }
);
