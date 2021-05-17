import express, {json, urlencoded} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import userRouter from './routes/users-routes.js';
import authRouter from './routes/auth-routes.js';

// Basic setup
dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {credentials: true, origin: process.env.url || '*'};
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());
app.use(urlencoded({extended: true}));

// Using path directory
app.use('/', express.static(join(__dirname, 'public')));

// Creating route

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter)

// running server
app.listen(PORT, (err) => {
    if (err) {
        console.log(err.message);
    }
})