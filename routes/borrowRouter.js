// routes/borrowRouter.js
import express from "express";
import { createBorrow, getQuote, getBorrow } from "../controllers/borrowController.js";

const borrowRouter = express.Router();

borrowRouter.post("/", createBorrow);
borrowRouter.post("/quote",getQuote);
borrowRouter.get("/", getBorrow);

export default borrowRouter;




