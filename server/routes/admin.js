const express = require("express");
const router = express.Router();

const adminControllers = require("../controllers/admin");

router.get("/search/:q", adminControllers.search);

module.exports = router;
