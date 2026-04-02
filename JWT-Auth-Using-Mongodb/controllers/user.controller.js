import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.insertOne({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: newUser._id
        })

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({
            success: false,
            message: "Server error during registration"
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const payload = {
            id: user._id,
            name: user.name,
            email: user.email
        }

        const access_token = generateAccessToken(payload);
        const refresh_token = generateRefreshToken(payload);

        user.refreshToken = refresh_token;
        await user.save();

        res.cookie("refreshToken", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: access_token
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error during login"
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "No refresh token provided"
            });
        }

        const user = await User.findOne({ refreshToken });

        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: 'Strict' });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error during logout"
        })
    }
}

export {
    registerUser,
    loginUser,
    logoutUser
}