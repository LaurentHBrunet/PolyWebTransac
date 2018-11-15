"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema({
  id: { type: Number, unique: true },
  firstName: String ,
  lastName: String,
  email: String,
  phone: String,
  products: Array
}, { collection: 'orders' }, { versionKey: false });


const Product = new Schema({
  id: { type: Number, unique: true },
  name: {type: String, required: true},
  price: {type: Number, required: true, min: 0},
  image: {type: String, required: true},
  category: {
    type: String,
    enum: ["cameras", "computers", "consoles", "screens"],
    required: true
  },
  description: {type: String, required: true},
  features: {type: [String], required: true},
}, { collection: 'produits' }, { versionKey: false });

var OrderDBO = mongoose.model("Order", Order);
var ProductDBO = mongoose.model("Product", Product);

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://TP4:TP41624509@ds161856.mlab.com:61856/online-shop-16245029", { useMongoClient: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function (callback) {
  console.log('Successfully connected to MongoDB.');
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
        promise.sort({ "price": 1 });
        break;
      case "price-dsc":
        promise.sort({ "price": -1 });
        break;
      case "alpha-asc":
        promise.collation({locale: "en"}).sort({ "name": 1 });
        break;
      case "alpha-dsc":
        promise.collation({locale: "en"}).sort({ "name": -1 });
        break;
    }
    return promise;
  },
  addProduct : function addProduct(id, name, price, image, category, description, features) {
    var newProduct = new ProductDBO();
    newProduct.id = id;
    newProduct.name = name;
    newProduct.price = price;
    newProduct.image = image;
    newProduct.category = category;
    newProduct.description = description;
    newProduct.features = features;
    return ProductDBO.create(newProduct)
  },
  removeProduct : function removeProduct(id) {
    return ProductDBO.findOneAndRemove({id: id }); 
  },
  removeAllProducts: function removeAllProducts() {
    return ProductDBO.remove({}); 
  }
}










// LoG4420_1624509_TP4

// DB User credentials  
// TP4
//TP41624509
