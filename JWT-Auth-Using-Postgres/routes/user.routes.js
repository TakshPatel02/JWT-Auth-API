import express from 'express';
import { login, logout, refresh, signup } from '../controllers/user.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
});

router.post("/signup", signup);

router.post("/login", login);

router.delete("/logout", logout);

router.post("/refresh", refresh);

export default router;