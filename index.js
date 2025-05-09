import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import returnRouter from "./routes/returnRouter.js";
import cors from "cors";

dotenv.config();

const app = express();

const mongoUrl = process.env.MONGO_DB_URI;

app.use(cors());

mongoose.connect(mongoUrl,{});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Database connected");
});

app.use(bodyParser.json());

app.use(
    
    (req, res, next) => {

        const token = req.header("Authorization")?.replace("Bearer ", "");
        console.log(token);

        if(token != null) {
            jwt.verify(token, process.env.SECRET, (error, decoded) => {

                if(!error) {
                    req.user = decoded;
                }
            });
        }
        next();
    }
);
                
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
app.use("/api/borrows", borrowRouter);
app.use("/api/returns", returnRouter);

app.listen(
    8000,
     () => {
        console.log("Server is running on port 8000");
    }
);

