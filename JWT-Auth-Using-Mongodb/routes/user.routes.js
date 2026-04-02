import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.delete('/logout', logoutUser);

router.get('/profile', authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
});

export default router;