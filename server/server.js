import express from 'express'
import dotenv from 'dotenv'
import connectDB from './connectDB/connectDB.js';

const app = express();
dotenv.config();

connectDB()

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})