import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET; // Ensure SECRET is defined properly
// ✅ Register User
export async function createUser(req, res) {
    try {
        const { fullName, email, password, role, profilePicture } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if an admin or librarian already exists.
        const existingAdmin = await User.findOne({ role: "admin" });
        const existingLibrarian = await User.findOne({ role: "librarian" }); // ✅ Define existingLibrarian

        let userRole = "user";  // Default role is "user"

        // Handle admin or librarian creation
        if (role === "admin" || role === "librarian") {
            // Allow first admin creation
            if (!existingAdmin && role === "admin") {
                userRole = "admin";
            } 
            // Allow first librarian creation
            else if (!existingLibrarian && role === "librarian") {
                userRole = "librarian";
            } 
            // Restrict further librarian/admin creation to admins
            else if (!req.user || req.user.role !== "admin") {
                return res.status(403).json({ message: "Only admins can create admin/librarian accounts." });
            } else {
                userRole = role;
            }
        }

        // Check if user already exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: userRole,
            profilePicture
        });

        // Save the new user to the database
        await newUser.save();
        res.status(200).json({ message: "User created successfully." });
    } catch (error) {
        res.status(500).json({ message: "User not created.", error: error.message });
    }
}

// ✅ Login User
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
                fullName: user.fullName,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed.", error: error.message });
    }
}

// ✅ Role Check Functions
export function isAdmin(req) {
    return req.user?.role === "admin";
}

export function isLibrarian(req) {
    return req.user?.role === "librarian";
}

export function isUser(req) {
    return req.user?.role === "user";
}

// ✅ Get Current User
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
