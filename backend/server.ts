import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors'
import { USERS_URL } from "./src/constants/constant";
const envPath = path.join(__dirname, 'env', 'development.env');
dotenv.config({ path: envPath });
import EnvVars from './src/constants/EnvVars';
import mongoose from 'mongoose';
import cookieparser from "cookie-parser";
import NotesRoute from './src/routes/NotesRoute';
import AuthUserRoutes from './src/routes/UserRoutes';
import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from './src/constants/HttpStatusCodes'
import passport from 'passport';
import './src/middlewares/passport-config.ts'


//Connect to MongoDB
async function connectToMongo() {
  try {
    await mongoose.connect(EnvVars.MongoDB_URL);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error Connecting to MongoDB', error);
  }
}
//Call The Function
connectToMongo();


// Initiate Express
const app = express();


// Add your Middlewares & Other Logics Here
app.use(express.json());
app.use(cors({
  origin: `${USERS_URL}`,
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  credentials: true
}));
app.use(cookieparser());
app.use(passport.initialize());

//Test Sample Route
app.get('/api', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send('Welcome Back To My Note');
  } catch (error) {
    console.error('Error Getting Signal', error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
    next(error);
  }
});

//Define Routes Here
app.use('/api/notes', NotesRoute); //Note Related Routes
app.use('/v1/Auth', AuthUserRoutes); //Auth User Related Routes

// Listen to Server Response
const port = EnvVars.Port;
app.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});


// Export the app instance
module.exports = app; 