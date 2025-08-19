const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.post(
  "/",
  authenticateToken,
  authorizeRoles(["user"]),
  async (req, res) => {
    const { title, description } = req.body;
    console.log("title, description", title, description);

    try {
    } catch (err) {
      console.error("Login Error-", err);
      res.status(500).json({ message: "Login Server Error" });
    }
  }
);

module.exports = router;
