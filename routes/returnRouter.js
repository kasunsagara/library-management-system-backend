import express from "express";
import { createReturn, getReturns, getReturnById } from "../controllers/returnController.js";

const returnRouter = express.Router();

returnRouter.post("/", createReturn);
returnRouter.get("/", getReturns);
returnRouter.get("/:returnId", getReturnById);

export default returnRouter;
