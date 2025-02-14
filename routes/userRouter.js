import express from 'express';
import { getUser, createUser, loginUser, googleLogin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get("/", getUser)
userRouter.post("/", createUser)
userRouter.post("/login", loginUser)
userRouter.post("/google", googleLogin)

export default userRouter;