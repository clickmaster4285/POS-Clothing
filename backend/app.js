const express = require("express");
const cors = require("cors");
const path = require("path");

const indexRouter = require("./routes/index.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

/* ========================
   Middlewares
======================== */
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========================
   Static files
======================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ========================
   Routes
======================== */
app.use("/", indexRouter);

/* ========================
   Health Check (optional)
======================== */
app.get("/pos-clothing", (req, res) => {
  res.json({ status: "OK" });
});

/* ========================
   Error Handler (LAST)
======================== */
app.use(errorHandler);

module.exports = app;
