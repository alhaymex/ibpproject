const express = require("express");
const router = express.Router();

const adminControllers = require("../controllers/admin");

router.get("/search/:q", adminControllers.search);

router.get("/user/:id", adminControllers.getUser);

module.exports = router;
