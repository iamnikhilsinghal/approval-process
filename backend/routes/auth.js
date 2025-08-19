const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../db");

// const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await pool.query("SELECT * FROM users where email = $1", [
      email,
    ]);
    if (userExist.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials- Email does not exist" });
    }

    const user = userExist.rows[0];

    // const valid = await bcrypt.compare(password, user.password);
    const valid = password === user.password;
    if (!valid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .status(200)
      .json({ token, username: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error("Login Error-", err);
    res.status(500).json({ message: "Login Server Error" });
  }
});

module.exports = router;
