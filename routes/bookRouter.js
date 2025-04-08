import express from "express";
import { createBook, getBooks, getBookById, searchBooks, deleteBook, updateBook } from '../controllers/bookController.js';

const bookRouter = express.Router();

bookRouter.post("/", createBook);
bookRouter.get("/", getBooks);
bookRouter.get("/:bookId", getBookById);
bookRouter.get("/search/:query", searchBooks);
bookRouter.delete("/:bookId", deleteBook);
bookRouter.put("/:bookId", updateBook);

export default bookRouter;

