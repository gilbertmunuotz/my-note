// Import NPM packages (using require)
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
const envPath = path.resolve(__dirname, '../env', 'development.env');
dotenv.config({ path: envPath });
import EnvVars from './constants/EnvVars';
import mongoose from 'mongoose';
// import UserRoutes from './routes/UserRoutes';
import NotesRoute from './routes/NotesRoute';


//Connect to MongoDB
async function connectToMongo() {
  try {
    await mongoose.connect(EnvVars.MongoDB_URL);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error Connecting to MongoDB', error);
  }
}
connectToMongo();

// Initiate Express
const app = express();

// Middleware
app.use(express.json());

// Routes
// app.use(UserRoutes);
app.use(NotesRoute);

// Listen to Server Response
const port = EnvVars.Port || 4000;
app.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});

// Export the app instance
module.exports = app; 