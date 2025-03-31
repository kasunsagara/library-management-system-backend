import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function createUser(req, res) {
    const newUserData = req.body;

    if (!newUserData.FullName || !newUserData.email || !newUserData.password || !newUserData.confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (newUserData.password !== newUserData.confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    if (newUserData.role === "admin" || newUserData.role === "librarian") {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Only an admin can create admin or librarian accounts." });
        }
    } else {
        newUserData.role = "user";
    }

    newUserData.password = bcrypt.hashSync(newUserData.password, 10);
    delete newUserData.confirmPassword; 

    const user = new User(newUserData);
    
    user.save()
        .then(() => {
            res.status(201).json({ message: "User created successfully." });
        })
        .catch((error) => {
            res.status(500).json({ message: "User not created.", error: error.message });
        });
}

export function loginUser(req, res) {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: "Incorrect password" });
            }

            const token = jwt.sign(
                {
                    email: user.email,
                    FullName: user.FullName,
                    role: user.role,
                    profilePicture: user.profilePicture,
                },
                process.env.SECRET,
                { expiresIn: "1h" }
            );

            res.json({
                message: "User logged in",
                token: token,
                user: {
                    email: user.email,
                    FullName: user.FullName,
                    role: user.role,
                    profilePicture: user.profilePicture,
                },
            });
        })
        .catch((error) => {
            res.status(500).json({ message: "Login failed", error: error.message });
        });
}

export function isAdmin(req) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role !== "admin") {
        return false;
    }
    return true;
}

export function isLibrarian(req) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role !== "librarian") {
        return false;
    }
    return true;
}

export function isUser(req) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role !== "user") {
        return false;
    }
    return true;
}

export async function getUser(req, res) {
    if (req.user == null) {
        return res.status(401).json({ message: "Please login to view user details" });
    }
    res.json(req.user);
}
