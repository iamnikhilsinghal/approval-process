const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const {  } = req.body;
  try {
  } catch (err) {
    console.error("Login Error-", err);
    res.status(500).json({ message: "Login Server Error" });
  }
});

module.exports = router;
