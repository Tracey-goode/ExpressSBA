import express from 'express';
import booksRoute from './routes/books.mjs';
import logger from './middleware/logger.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

