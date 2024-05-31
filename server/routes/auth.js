const express = require("express");
const router = express.Router();

const authControllers = require("../controllers/auth");

router.get("/checkAuth", authControllers.checkAuth);

router.post("/login", authControllers.login);

module.exports = router;
