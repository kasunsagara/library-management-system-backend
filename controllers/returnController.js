import Return from "../models/return.js";
import Borrow from "../models/borrow.js";
import { isUser, isLibrarian, isAdmin } from "./userController.js";

export async function createReturn(req, res) {
  try {
    if (!isUser(req)) {
      return res.status(403).json({ message: "Only users can return books." });
    }

    const { borrowId } = req.body;

    const borrow = await Borrow.findOne({ borrowId });
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found." });
    }

    const existingReturn = await Return.findOne({ borrowId });
    if (existingReturn) {
      return res.status(400).json({ message: "This book has already been returned." });
    }

    const today = new Date();
    const dueDate = new Date(borrow.dueDate);
    let fine = 0;

    if (today > dueDate) {
      const diffTime = Math.abs(today - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 10; // 10 currency units per day
    }

    const latestReturn = await Return.find().sort({ returnId: -1 }).limit(1);
    const returnId = latestReturn.length === 0 
      ? "RET0001"
      : "RET" + (parseInt(latestReturn[0].returnId.replace("RET", "")) + 1).toString().padStart(4, "0");

    const returned = new Return({
      returnId,
      borrowId,
      fine,
      email: req.user.email,
    });

    await returned.save();
    res.json({ message: "Book returned successfully", returned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getReturns(req, res) {
  try {
    if (isUser(req)) {
      const returns = await Return.find({ email: req.user.email });
      return res.json(returns);
    } else if (isLibrarian(req) || isAdmin(req)) {
      const returns = await Return.find();
      return res.json(returns);
    } else {
      return res.status(403).json({ message: "Login required" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getReturnById(req, res) {
  try {
    const { returnId } = req.params;
    const user = req.user;

    const returnRecord = await Return.findOne({ returnId });

    if (!returnRecord) {
      return res.status(404).json({ message: "Return record not found." });
    }

    if (isUser(req) && returnRecord.email !== user.email) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.json(returnRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


