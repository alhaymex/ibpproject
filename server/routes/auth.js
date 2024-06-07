const express = require("express");
const router = express.Router();

const authControllers = require("../controllers/auth");

router.get("/checkAuth", authControllers.checkAuth);

router.post("/login", authControllers.login);

router.post("/register", authControllers.register);

router.post("/logout", authControllers.logout);

router.get("/profile", authControllers.profile);

router.post("/updateprofile", authControllers.updateProfile);

module.exports = router;
