import express from "express";
import { createBook, getBooks, deleteBook, updateBook } from '../controllers/bookController.js';

const bookRouter = express.Router();

bookRouter.post("/", createBook);
bookRouter.get("/", getBooks);
bookRouter.delete("/:bookId", deleteBook);
bookRouter.put("/:bookId", updateBook);

export default bookRouter;

