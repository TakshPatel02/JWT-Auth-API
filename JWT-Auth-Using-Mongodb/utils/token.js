import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
    return jwt.sign(
        user,
        process.env.ACCESS_JWT_SECRET,
        { expiresIn: '1h' }
    );
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        user,
        process.env.REFRESH_JWT_SECRET,
        { expiresIn: '7d' }
    );
}

export {
    generateAccessToken,
    generateRefreshToken
}