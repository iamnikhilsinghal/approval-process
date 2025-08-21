const express = require("express");
const cors = require("cors");
require("dotenv").config();

// const db = require("./db");

const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/users");
// const categoryRoutes = require("./routes/categories");
const requestRoutes = require("./routes/requests");
const path = require("path");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
// app.use("/categories", categoryRoutes);
app.use("/requests", requestRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "This is our Approval App" });
});
app.all("/{*any}", (req, res) => {
  res.status(404).send("404: Page not found");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
