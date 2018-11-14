const express = require("express");
const router = express.Router();
const app = express();

// Load products

var products = require("../public/products.json");

router.get(["/", "/accueil"], (req, res) => {
  res.render("index", { title: "Accueil", activeNav: "accueil" });
});

router.get("/produits", (req, res) => {
  res.render("products", { title: "Produits", activeNav: "produits" });
});

router.get("/produits/:id", (req, res) => {
  res.render("product", { title: "Produit", activeNav: "produits", product: req.params.id });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact", activeNav: "contact" });
});

router.get("/panier", (req, res) => {
  res.render("shopping-cart", { title: "Shopping Cart", activeNav: "none" });
});

router.get("/commande", (req, res) => {
  res.render("order", { title: "Order", activeNav: "none" });
});

router.get("/confirmation", (req, res) => {
  res.render("confirmation", { title: "Confirmation", activeNav: "none" });
});

// Shopping cart API

// 1. Get shopping Cart
router.get("/api/shopping-cart", (req, res, next) => {
  if (req.session.cart) {
    res.send(req.session.cart);
  } else {
    res.write("[]");
  }
  res.end();
});
// 2. Get Product
router.get("/api/shopping-cart/:id", (req, res) => {
  console.log(req.params.id);
  if (!req.session.cart || req.session.cart.length == 0) {
    res.status(404);
    res.end();
  } else {
    // find product in cart
    req.session.cart.forEach(function (product) {
      if (product.productId == req.params.id) {
        res.send(product);
        res.end();
      }
    });
    res.status(404);
    res.end();
  }
});
// 3. POST Item
router.post("/api/shopping-cart", (req, res, next) => {
  if (req.session.cart) {
  } else {
    req.session.cart = [];
  }
  // check if item exists
  // check if product is already in cart, return 400
  if (getProduct(req.query.productId) == null || getProductFromCart(req.session.cart, id) != null) {
    res.status(400);
    res.end();
  } else {
  var product = new Product(req.query.productId, req.query.quantity);
  console.log(product);
  req.session.cart.push(product);
  res.send(req.session.cart);
  res.status(201);
  res.end();
  }
});
// 4. PUT: Modify existing item in cart
router.put("/api/shopping-cart/:id", (req, res) => {
  var product = getProductFromCart(req.session.cart, req.params.id);
  if (product == null) {
    res.status(404)
    res.end();
  } else {
    product.quantity = req.query.quantity;
    res.status(204);
    // Todo remove debugging
    res.send(req.session.cart);
    res.end();
  }
});



module.exports = router;
class Product {
  constructor(productId, quantity) {
    this.productId = productId;
    this.quantity = quantity;
  }
}

// Utils

function getProduct(id) {
  products.forEach(function (product) {
    if (product.id == id) {
      console.log("Found product with id " + id + ": " + product);
      return product;
    }
  });
  return null;
}

function getProductFromCart(cart, id) {
  cart.forEach(function (product) {
    if (product.id == id) {
      console.log("Found product with id " + id + ": " + product);
      return product;
    }
  });
  return null;
}
