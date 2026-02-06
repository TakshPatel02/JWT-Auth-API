import db from '../db/index.js'
import usersTable from '../models/user.models.js'
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/token.util.js';

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }
        const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: `User with this email ${email} already exists.`
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await db.insert(usersTable).values({
            name,
            email,
            password: hashedPassword
        }).returning();

        return res.status(201).json({
            sucess: true,
            message: "User registered successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            })
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await db.update(usersTable).set({
            refreshToken: refreshToken
        }).where(eq(usersTable.id, user.id));

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            accessToken: accessToken
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token not found."
            })
        }

        await db.update(usersTable).set({
            refreshToken: null
        }).where(eq(usersTable.refreshToken, refreshToken));

        res.clearCookie('refreshToken');

        return res.status(200).json({
            success: true,
            message: "Logout successful."
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found."
            })
        }

        const [user] = await db.select().from(usersTable).where(eq(usersTable.refreshToken, refreshToken));

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token."
            })
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if(err){
                    return res.status(403).json({
                        success: false,
                        message: "Invalid or expired refresh token.",
                    });
                }

                const newAccessToken = generateAccessToken(user);
                return res.status(200).json({
                    success: true,
                    accessToken: newAccessToken
                })
            }
        )

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export {
    signup,
    login,
    logout,
    refresh
}