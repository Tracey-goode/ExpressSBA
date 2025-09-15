import express from 'express';
import { validator } from '../middleware/validate.mjs';
import { readFile, writeFile } from 'fs/promises'; // 

const router = express.Router();
const bookPath = '../data/books.json';

async function readBooks() {
    const data = await readFile(bookPath, 'utf-8');
    return JSON.parse(data);
}

async function writeBooks(data) {
    await writeFile(bookPath, JSON.stringify(data, null, 2));
}


// Gett
router.get('/', async (req, res) => {
    try {
        const books = readBooks();
        const { genre } = req.query;
        const filtered = genre ? books.filter(book => book.genre === genre) : books;
        res.render('books', {books: filtered });
    } catch (err) {
        next (err);
    }
});


