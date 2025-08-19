const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const pool = require("../db");

router.post(
  "/",
  authenticateToken,
  authorizeRoles(["user"]),
  async (req, res) => {
    const { categoty_id, title, description } = req.body;
    try {
      if (!categoty_id || !title || !description)
        return res.status(400).json({ error: "Missing Fields" });
      const createdReq = await pool.query(
        `INSERT INTO requests (user_id, category_id, title, description)
    VALUES ($1,$2,$3,$4) RETURNING *`,
        [req.user.id, categoty_id, title, description]
      );

      await pool.query(
        `INSERT INTO request_history (request_id, from_user, to_user, request_status, remarks)
    VALUES ($1,$2,NULL,'initiated','Request Created')`,
        [createdReq.rows[0].id, req.user.id]
      );

      res.status(201).json(createdReq.rows[0]);
    } catch (err) {
      console.error("Login Error-", err);
      res.status(500).json({ message: "Login Server Error" });
    }
  }
);

module.exports = router;
