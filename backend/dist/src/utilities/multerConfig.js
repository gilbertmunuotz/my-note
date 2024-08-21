"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// multerConfig.ts
const multer_1 = __importDefault(require("multer"));
// Set up storage engine for multer
const storage = multer_1.default.memoryStorage(); // Use memory storage for simplicity
// Initialize multer with the storage configuration
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
