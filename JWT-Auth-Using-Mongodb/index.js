import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './connection.js';
import userRouter from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URL).then(() => console.log("Database connected"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("hello world");
});

app.use("/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});