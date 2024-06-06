const express = require("express");
const router = express.Router();

const productsControllers = require("../controllers/products");

router.post("/new", productsControllers.new);

router.get("/all", productsControllers.getAll);

module.exports = router;
