import express from 'express';
import { getUser, getUsers, createUser, loginUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.get("/all", getUsers);
userRouter.post("/", createUser);
userRouter.post("/login", loginUser);

export default userRouter;
