const express = require("express");
const router = express.Router();
const app = express();

// Load products

var categories = ["cameras", "computers", "consoles", "screens", null];
var criteria = ["price-asc", "price-dsc", "alpha-asc", "alpha-dsc", null];

var products = require("../public/products.json");
var db = require("../lib/db");



router.get(["/", "/accueil"], (req, res) => {
  var cartCount = countItemsInCart(req.session.cart);
  res.render("index", { title: "Accueil", activeNav: "accueil", cartCount: cartCount });
});

router.get("/produits", (req, res) => {
  var cartCount = countItemsInCart(req.session.cart);
  db.getProducts().then((products) => {
    res.render("products", { title: "Produits", activeNav: "produits", products: products, cartCount: cartCount });
  });
});

router.get("/produits/:id", (req, res) => {
  var cartCount = countItemsInCart(req.session.cart);
  db.getProductById(req.params.id).then((product) => {
    if (product == null) {
      res.render("product", { title: "Non trouve", activeNav: "produits", product: null, cartCount: cartCount });
    } else {
      res.render("product", { title: "Produit", activeNav: "produits", product: product, cartCount: cartCount });
    }
  })
});

router.get("/contact", (req, res) => {
  var cartCount = countItemsInCart(req.session.cart);
  res.render("contact", { title: "Contact", activeNav: "contact", cartCount: cartCount });
});

router.get("/panier", (req, res) => {
  var cartCount = countItemsInCart(req.session.cart);
  var productsArray = new Array();
  var promises = [];
  var cart = req.session.cart;
  if(req.session.cart != null)  {
    for (var i = 0; i < req.session.cart.length; i++) {
      promises.push(db.getProductById(req.session.cart[i].productId).then((product) => {
        product.quantity = cart.find((value,index,arr) => {
          return value.productId == product.id;
       }).quantity;
       productsArray.push(product);
      }));
    }
  }
  
  Promise.all(promises).then((allProducts) => {
    productsArray.sort((a, b) => {
      return a.name.toLowerCase() > b.name.toLowerCase();
    });
    res.render("shopping-cart", { title: "Shopping Cart", activeNav: "none", cart: cart, cartCount: cartCount, productsArray: productsArray });
  })

});

router.get("/commande", (req, res) => {
  var cartCount = countItemsInCart(req.session.cart);
  res.render("order", { title: "Order", activeNav: "none", cartCount: cartCount });
});

router.post("/confirmation", (req, res) => {
  var name = req.body["first-name"] + " " + req.body["last-name"];

  res.render("confirmation", { title: "Confirmation", activeNav: "none", name: name, cartCount: 0 });
});

// Products API

// 1. GET: Get all products
router.get("/api/products", (req, res, next) => {
  // Check if valid request
  if (categories.findIndex(function (value, index, arr) {
    return value == req.query.category;
  }) == -1 || criteria.findIndex(function (value, index, arr) {
    return value == req.query.criteria;
  }) == -1) {
    res.status(400);
    res.end();
  } else {
    db.getProducts(req.query.category, req.query.criteria).then((products) => {
      res.send(products);
      res.end();
    });
  }
});
// 2. GET: Get Product by Id
router.get("/api/products/:id", (req, res) => {
  db.getProductById(req.params.id).then((product) => {
    if (product == null) {
      res.status(404);
    } else {
      res.send(product);
    }
    res.end();
  });
});
// 3. POST: Add new Item
router.post("/api/products/", (req, res) => {
  var product = req.body;
  db.addProduct(product.id, product.name, product.price, product.image,
    product.category, product.description, product.features).then(function (err, one, two) {
      res.status(201);
      res.end();
    }).catch((err) => {
      res.status(400);
      res.end();
    });
});
// 4. DELETE: Delete product
router.delete("/api/products/:id", (req, res) => {
  db.removeProduct(req.params.id).exec(function (err, item) {
    if (err || !item) {
      res.status(404);
    } else {
      res.status(204);
    }
    res.end();
  });
});
// 5. DELETE. Delete all products
router.delete("/api/products/", (req, res) => {
  db.removeAllProducts().exec(function (err, item) {
    res.status(204);
    res.end();
  });
});



// Shopping cart API

// 1. Get shopping Cart
router.get("/api/shopping-cart", (req, res, next) => {
  if (req.session.cart == null) {
    req.session.cart = new Array();
  }
  res.send(req.session.cart);
  res.end();
});
// 2. Get Product
router.get("/api/shopping-cart/:id", (req, res) => {
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
  if (req.session.cart == null) {
    req.session.cart = new Array();
  }
  var newProduct = req.body;
  db.getProductById(newProduct.productId).then(function (product) {
    if (!Number.isInteger(newProduct.quantity) || product == null || getProductFromCart(req.session.cart, newProduct.productId) != null) {
      res.status(400);
      res.end();
    } else {
      var product = new Product(newProduct.productId, newProduct.quantity);
      req.session.cart.push(product);
      res.status(201);
      res.end();
    }
  }).catch((err) => {
    res.status(400);
    res.end();
  });

});
// 4. PUT: Modify existing item in cart
router.put("/api/shopping-cart/:id", (req, res) => {
  if (!Number.isInteger(req.body.quantity)) {
    res.status(400);
    res.end();
  } else {
    var product = getProductFromCart(req.session.cart, req.params.id);
    if (product == null) {
      res.status(404)
      res.end();
    } else {
      // TODO check if qunatity ios a number
      product.quantity = req.body.quantity;
      res.status(204);
      res.end();
    }
  }
});
// 5. DELETE: Remove item from shopping cart
router.delete("/api/shopping-cart/:id", (req, res) => {
  var product = getProductFromCart(req.session.cart, req.params.id);
  if (product == null) {
    res.status(404)
    res.end();
  } else {
    req.session.cart = req.session.cart.filter(function (value, index, arr) {
      return value.productId != product.productId;
    });
    res.status(204);
    res.end();
  }
});
// 6. DELETE: Remove whole shopping cart
router.delete("/api/shopping-cart/", (req, res) => {
  req.session.cart = [];
  res.status(204);
  res.end();
});

// API commandes

// 1. GET get all orders
router.get("/api/orders", (req, res) => {
  db.getOrders().then((orders) => {
    res.send(orders);
    res.end();
  });
});

// 2. GET get order by id
router.get("/api/orders/:id", (req, res) => {
  db.getOrder(req.params.id).then((order) => {
    if (order.length > 0) {
      res.send(order[0]);
    } else {
      res.status(404);
    }
    res.end();
  });
});

// 3. POST create order
router.post("/api/orders/", (req, res) => {
  var order = req.body;
  db.addOrder(order.id, order.firstName, order.lastName, order.email, order.phone, order.products).then(function (err, one, two) {
    db.getProducts().then((products) => {
      for(var i = 0; i < order.products.length; i++) {
        if (products.findIndex(function (value,index,array) {
          return value.id == order.products[i].id;
        }) == -1) {
          res.status(400);
          res.end();
          return;
        }
      }
      res.status(201);
      res.end();
    });
  }).catch((err) => {
    res.status(400);
    res.end();
  });
});

// 4. Delete delete order by id
router.delete("/api/orders/:id", (req, res) => {
  db.removeOrder(req.params.id).exec(function (err, item) {
    if (err || !item) {
      res.status(404);
    } else {
      res.status(204);
    }
    res.end();
  })
});

// 5. Delete all orders
router.delete("/api/orders/", (req, res) => {
  db.removeAllOrders().exec(function (err, item) {
    res.status(204);
    res.end();
  })
});

module.exports = router;
class Product {
  constructor(productId, quantity) {
    this.productId = productId;
    this.quantity = quantity;
  }
}

// Utils

/*function getProduct(id) {
  return products.find(function (element) {
    return element.id == id;
  });
}*/

function getProductFromCart(cart, id) {
  return cart.find(function (element) {
    return element.productId == id;
  });
}

function removeFromCart(cart, product) {
  cart = cart.filter(function (value, index, arr) {
    value.productId != product.productId;
  });
}

function countItemsInCart(cart) {
  if (cart == null) {
    return 0;
  }
  var count = 0;
  for (var i = 0; i < cart.length; i++) {
    count += cart[i].quantity;
  }
  return count;
}



