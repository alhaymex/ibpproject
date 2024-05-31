const express = require("express");
const mongoose = require("mongoose");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const store = new MongoDBStore({
  uri: process.env.DBCONN,
  collection: "sessions",
});

// Routes imports
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));
app.use(bodyParser.json());

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use("/auth", authRoutes);

const port = process.env.PORT || 8080;
mongoose.connect(process.env.DBCONN).then(() => {
  app.listen(port, () => {
    console.log(`Connected to db at http://localhost:${port}`);
  });
});
