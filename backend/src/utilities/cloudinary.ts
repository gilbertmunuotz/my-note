import dotenv from "dotenv";
import cloudinaryModule from 'cloudinary';

// Load environment variables
dotenv.config();

// Create Instance of cloudinaryModule
const cloudinary = cloudinaryModule.v2;

// Config Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// **** Export default **** //
export { cloudinary };