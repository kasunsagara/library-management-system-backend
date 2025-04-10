import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET;
export async function createUser(req, res) {
    try {
        const { firstName, lastName, email, password, role, profilePicture } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingAdmin = await User.findOne({ role: "admin" });
        const existingLibrarian = await User.findOne({ role: "librarian" }); 

        let userRole = "user";  

        if (role === "admin" || role === "librarian") {
            if (!existingAdmin && role === "admin") {
                userRole = "admin";
            } 
            else if (!existingLibrarian && role === "librarian") {
                userRole = "librarian";
            } 
            else if (!req.user || req.user.role !== "admin") {
                return res.status(403).json({ message: "Only admins can create admin/librarian accounts." });
            } else {
                userRole = role;
            }
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: userRole,
            profilePicture
        });

        await newUser.save();
        res.status(200).json({ message: "User created successfully." });
    } catch (error) {
        res.status(500).json({ message: "User not created.", error: error.message });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({
            message: "User logged in successfully.",
            token,
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed.", error: error.message });
    }
}

export function isAdmin(req) {
    return req.user?.role === "admin";
}

export function isLibrarian(req) {
    return req.user?.role === "librarian";
}

export function isUser(req) {
    return req.user?.role === "user";
}

export async function getUser(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Please login to view user details." });
        }

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data.", error: error.message });
    }
}

export async function getUsers(req, res) {
    try {
      const users = await User.find(); 
      res.json(users);
    } catch (err) {
      res.status(500).json({
        message: "Error retrieving users",
        error: err.message
      });
    }
  }

  export async function deleteUser(req, res) {
    if (!isLibrarian(req)) {
        res.status(403).json({
            message: "Please login as librarian to delete users",
        });
        return;
    }

    const email = req.params.email;

    try {
        await User.deleteOne({ email: email });
        res.json({
            message: "User deleted"
        });
    } catch (error) {
        res.status(403).json({
            message: error
        });
    }
}