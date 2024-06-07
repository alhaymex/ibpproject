const express = require("express");
const router = express.Router();

const adminControllers = require("../controllers/admin");

router.get("/search/:q", adminControllers.search);

router.get("/user/:id", adminControllers.getUser);

router.post("/updateuser", adminControllers.updateUser);

router.post("/adduser", adminControllers.addUser);

module.exports = router;
