const express = require("express");
const router = express.Router();

const productsControllers = require("../controllers/products");

router.post("/new", productsControllers.new);

router.get("/all", productsControllers.getAll);

router.post("/addtocart", productsControllers.addToCart);

router.post("/removefromcart", productsControllers.removeFromCart);

router.get("/getcart", productsControllers.getCart);

module.exports = router;
