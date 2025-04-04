import express from 'express';
import { getUser, createUser, loginUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

export default userRouter;
