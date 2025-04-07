import express from "express";
import { createBook, getBooks } from '../controllers/bookController.js';

const bookRouter = express.Router();

bookRouter.post("/", createBook);
bookRouter.get("/", getBooks);

export default bookRouter;

