const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT;
const connectDB = require("./config/db");

// Connect Database
connectDB();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/auth.router"));
app.use("/api/users", require("./routes/users.router"));

app.listen(PORT, () => {
  console.log(`Farmerzon Api:  http://localhost:${PORT}`);
});
