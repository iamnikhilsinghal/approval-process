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

router.get(
  "/approver-inbox",
  authenticateToken,
  authorizeRoles(["approver"]),
  async (req, res) => {
    try {
      const approverInboxReq = await pool.query(
        `select * from requests where decided_by=$1`,
        [req.user.id]
      );
      res.status(200).json(approverInboxReq.rows[0]);
    } catch (err) {
      console.error("Login Error-", err);
      res.status(500).json({ message: "Login Server Error" });
    }
  }
);

router.post(
  "/:id/approve",
  authenticateToken,
  authorizeRoles(["approver"]),
  async (req, res) => {
    const { id } = req.params;
    const { remarks } = req.body;
    try {
      const updatedReq = await pool.query(
        `UPDATE requests SET status='approved', decided_by=$1, decided_at=now() where id=$2 RETURNING *`,
        [req.user.id, id]
      );

      await pool.query(
        `INSERT INTO request_history (request_id, from_user, to_user, request_status, remarks)
    VALUES ($1,$2,NULL,'approved',$3)`,
        [id, req.user.id, remarks]
      );

      res.status(201).json(updatedReq.rows[0]);
    } catch (err) {
      console.error("Login Error-", err);
      res.status(500).json({ message: "Login Server Error" });
    }
  }
);

router.post(
  "/:id/reject",
  authenticateToken,
  authorizeRoles(["approver"]),
  async (req, res) => {
    const { id } = req.params;
    const { remarks } = req.body;
    try {
      const updatedReq = await pool.query(
        `UPDATE requests SET status='rejected', decided_by=$1, decided_at=now() where id=$2 RETURNING *`,
        [req.user.id, id]
      );

      await pool.query(
        `INSERT INTO request_history (request_id, from_user, to_user, request_status, remarks)
    VALUES ($1,$2,NULL,'rejected',$3)`,
        [id, req.user.id, remarks]
      );

      res.status(201).json(updatedReq.rows[0]);
    } catch (err) {
      console.error("Login Error-", err);
      res.status(500).json({ message: "Login Server Error" });
    }
  }
);

module.exports = router;
