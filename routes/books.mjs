import express from 'express';
import { validator } from '../middleware/validate.mjs';
import { readFile, writeFile } from 'fs/promises'; // 

const router = express.Router();
const bookPath = './data/books.json';

async function readBooks() {
    const data = await readFile(bookPath, 'utf-8');
    return JSON.parse(data);
}

async function writeBooks(data) {
    await writeFile(bookPath, JSON.stringify(data, null, 2));
}


// Gett
router.get('/', async (req, res, next) => {
    try {
        const books = await readBooks();
        const { genre } = req.query;
        const filtered = genre ? books.filter(book => book.genre === genre) : books;
        res.render('books', {books: filtered });
    } catch (err) {
        next (err);
    }
});

// GET new book form
router.get('/new', (req, res) => {
    res.render('add-book');
});

// GET one book by ID
router.get('/:id', async (req, res, next) => {
    try {
        const books = await readBooks();
        const book = books.find(b => b.id == req.params.id);
        if (!book) return res.status(404).send('Book not found');
        res.json(book);
    } catch (err) {
        next(err);
    }
});


// Post
router.post('/', validator, async (req, res, next) => {
    try {
        const books = await readBooks();
        const newBook = {
            id: Date.now(),
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
        };
        books.push(newBook);
        await writeBooks(books);
        res.redirect('/books');
    } catch (err) {
        next(err);
    }
});


// Patch
router.patch('/:id', async (req, res, next) => {
    try {
        const books = await readBooks();
        const book = books.find(b => b.id == req.params.id);
        if (!book) return res.status(404).send('Book not found');

        Object.assign(book, req.body); // Merge changes
        await writeBooks(books);
        res.json(book);
    } catch (err) {
        next(err);
    }
});

// Delete

router.delete('/:id', async (req, res, next) => {
    try {
        let books = await readBooks();
        const initialLength = books.length;
        books = books.filter(b => b.id != req.params.id);

        if (books.length === initialLength) {
            return res.status(404).send('Book not found');
        }

        await writeBooks(books);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

export default router;
