const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

// Routes imports
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));
app.use(bodyParser.json());

app.use("/auth", authRoutes);

const port = process.env.PORT || 8080;
mongoose.connect(process.env.DBCONN).then(() => {
  app.listen(port, () => {
    console.log(`Connected to db at http://localhost:${port}`);
  });
});
