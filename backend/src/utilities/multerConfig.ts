// multerConfig.ts
import multer from 'multer';

// Set up storage engine for multer
const storage = multer.memoryStorage(); // Use memory storage for simplicity

// Initialize multer with the storage configuration
const upload = multer({ storage });

export default upload;