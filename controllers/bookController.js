import Book from "../models/book.js";
import { isLibrarian } from "./userController.js";

export async function createBook(req, res) {

    if(!isLibrarian(req)) {
        res.status(403).json({
            message: "Please login as librarian to create books"
        });
        return;
    }

    const newBookData = req.body;

    try {
        const book = new Book(newBookData);
        await book.save();
        res.json({
            message: "book created"
        });
    } catch (error) {
        res.status(403).json({
            message: error
        });
    }
}

export async function getBooks(req, res) {

    try {
        const books = await Book.find({});
        res.json(books);
    } catch (error) {
        res.json({
            message: error
        });
    }
}

export async function getBookById(req, res) {

    try {
        const bookId = req.params.bookId;

        const book = await Book.findOne({bookId: bookId});

        res.json(book);

    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
}

export async function searchBooks(req, res) {
    const query = req.params.query;
    try {
      const books = await Book.find({
        $or: [
          { bookName: { $regex: query, $options: "i" } },
        ],
      });
      res.json(books);
    } catch (e) {
      res.status(500).json({
        e,
      });
    }
  }

export async function deleteBook(req, res) {
    if (!isLibrarian(req)) {
        res.status(403).json({
            message: "Please login as librarian to delete books",
        });
        return;
    }

    const bookId = req.params.bookId;

    try {
        await Book.deleteOne({ bookId: bookId });
        res.json({
            message: "Book deleted",
        });
    } catch (error) {
        res.status(403).json({
            message: error
        });
    }
}

export async function updateBook(req, res) {
    if (!isLibrarian(req)) {
        res.status(403).json({
            message: "Please login as librarian to update books",
        });
        return;
    }

    const bookId = req.params.bookId;
    const newBookData = req.body;

    try {
        await Book.updateOne({ bookId: bookId }, newBookData);
        res.json({
            message: "Book updated"
        });
    } catch (error) {
        res.status(403).json({
            message: error
        });
    }
}

