import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    return jwt.sign({
        userId: user.id,
        name: user.name,
        email: user.email
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1m'
    });
}

export const generateRefreshToken = (user) => {
    return jwt.sign({
        userId: user.id,
        name: user.name,
        email: user.email
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    })
}