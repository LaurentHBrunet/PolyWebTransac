const express = require("express");
const router = express.Router();

router.get(["/", "/accueil" ], (req, res) => {
  res.render("index", { title: "Accueil", activeNav: "accueil"});
});

router.get("/produits" , (req, res) => {
  res.render("products", { title: "Produits", activeNav: "produits"});
});

router.get("/produits/:id" , (req, res) => {
  res.render("product", { title: "Produit", activeNav: "produits", product: req.params.tagId});
});

router.get("/contact" , (req, res) => {
  res.render("contact", { title: "Contact", activeNav: "contact"});
});

router.get("/panier" , (req, res) => {
  res.render("shopping-cart", { title: "Shopping Cart", activeNav: "none"});
});

router.get("/commande" , (req, res) => {
  res.render("order", { title: "Order", activeNav: "none"});
});

router.get("/confirmation" , (req, res) => {
  res.render("confirmation", { title: "Confirmation", activeNav: "none"});
});

module.exports = router;
