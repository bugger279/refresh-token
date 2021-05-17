import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    await pool.query(`SELECT * FROM users`, (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rowCount > 0) {
        res.status(200).json({ data: results.rows });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, hashedPassword],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rowCount > 0) {
          res.status(200).json({ data: results.rows });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
