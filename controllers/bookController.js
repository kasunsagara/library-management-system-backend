import Book from "../models/book.js";
import { isAdmin } from "./userController.js";

export async function createBook(req, res) {

    if(!isAdmin(req)) {
        res.status(403).json({
            message: "Please login as administrator to add book"
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