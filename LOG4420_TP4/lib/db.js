"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema(
  {
    id: { type: Number, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      validate: {
        validator: function(v) {
          var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return emailRegex.test(v);
        }
      }
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return /\d{3}-\d{3}-\d{4}/.test(v);
        }
      }
    },
    products: {
      type: Array,
      validate: { validator: function(v) {
          for (var i = 0; i < v.length; i++) {
            if (
              typeof v[i].id != "number" ||
              typeof v[i].quantity != "number"
            ) {
              return false;
            } 
            if (v[i].quantity <= 0) {
              return false;
            }
          }
          return true;
        }, msg: 'Wrong formatting of products' },
    }
  },
  { collection: "orders" },
  { versionKey: false }
);



const Product = new Schema(
  {
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ["cameras", "computers", "consoles", "screens"],
      required: true
    },
    description: { type: String, required: true },
    features: {
      type: [String],
      validate: {
        validator: function(arr) {
          return (
            arr.length > 0 &&
            arr.findIndex((value, index, arr) => {
              return value == "";
            }) == -1
          );
        }
      },
      required: true
    }
  },
  { collection: "produits" },
  { versionKey: false }
);

var OrderDBO = mongoose.model("Order", Order);
var ProductDBO = mongoose.model("Product", Product);

mongoose.Promise = global.Promise;

mongoose.connect(
  "mongodb://TP4:TP41624509@ds161856.mlab.com:61856/online-shop-16245029",
  { useMongoClient: true }
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function(callback) {
  console.log("Successfully connected to MongoDB.");
});
module.exports = {
  getProductById: function getProductById(id) {
    return ProductDBO.findOne({ id: id });
  },
  getProducts: function getProducts(category, filter = "price-asc") {
    var promise;
    if (category == null) {
      promise = ProductDBO.find({});
    } else {
      promise = ProductDBO.find({ category: category });
    }
    switch (filter) {
      case "price-asc":
        promise.sort({ price: 1 });
        break;
      case "price-dsc":
        promise.sort({ price: -1 });
        break;
      case "alpha-asc":
        promise.collation({ locale: "en" }).sort({ name: 1 });
        break;
      case "alpha-dsc":
        promise.collation({ locale: "en" }).sort({ name: -1 });
        break;
    }
    return promise;
  },
  addProduct: function addProduct(
    id,
    name,
    price,
    image,
    category,
    description,
    features
  ) {
    var newProduct = new ProductDBO();
    newProduct.id = id;
    newProduct.name = name;
    newProduct.price = price;
    newProduct.image = image;
    newProduct.category = category;
    newProduct.description = description;
    newProduct.features = features;
    return ProductDBO.create(newProduct);
  },
  removeProduct: function removeProduct(id) {
    return ProductDBO.findOneAndRemove({ id: id });
  },
  removeAllProducts: function removeAllProducts() {
    return ProductDBO.remove({});
  },
  getOrders: function getOrders() {
    return OrderDBO.find();
  },
  getOrder: function getOrder(id) {
    return OrderDBO.find({ id: id });
  },
  addOrder: function addOrder(id, firstName, lastName, email, phone, products) {
    var newOrder = new OrderDBO();
    newOrder.id = id;
    newOrder.firstName = firstName;
    newOrder.lastName = lastName;
    newOrder.email = email;
    newOrder.phone = phone;
    newOrder.products = products;
    return OrderDBO.create(newOrder);
  },
  removeOrder: function removeOrder(id) {
    return OrderDBO.findOneAndRemove({ id: id });
  },
  removeAllOrders: function removeAllOrders() {
    return OrderDBO.remove({});
  }
};

// Mlab username password
// LOG4420_1624509
// LoG4420_1624509_TP4

// DB User credentials
// TP4
//TP41624509
