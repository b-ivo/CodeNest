import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import signUpRoute from './auth/signup.js'
import connectDB from './connectDB/connectDB.js';

dotenv.config();
connectDB()

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', signUpRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})