import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { jwtToken } from '../utils/jwt-helpers.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await pool.query(`SELECT * FROM users WHERE user_email = $1`, [email], async (error, results) => {
            if (error) {
                throw error;
            }
            if (results.rowCount <= 0) {
                res.status(401).json({message: 'Incorrect Email Id'});
            }
            if (results.rowCount > 0) {
                const validPassword = await bcrypt.compare(password, results.rows[0].user_password);
                if (!validPassword) {
                    res.status(401).json({message: 'Invalid Email or password'});
                } else {
                    let tokens = jwtToken(results.rows[0])
                    res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true})
                    res.status(200).json({tokens});
                }
            }
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/refresh_token', async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            res.status(401).json({message: "No Token Found"});
        }
        await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) {
                res.status(403).json({message: error.message})
            }
            let tokens = jwtToken(user);
            res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true});
            res.json(tokens);
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.delete('/refresh_token', async (req, res) => {
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({message: 'Refresh token deleted'});
    } catch (error) {
        res.status(401).json({message: error.message})
    }
})
export default router;