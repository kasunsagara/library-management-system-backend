import Borrow from "../models/borrow.js";
import Book from "../models/book.js";
import { isLibrarian, isUser } from "./userController.js";

export async function createBorrow(req, res) {
  if (!isUser(req)) {
    return res.status(403).json({ message: "Please login as user to create borrows" });
  }

  try {
    const latestBorrow = await Borrow.find().sort({ borrowId: -1 }).limit(1);
    let borrowId = latestBorrow.length === 0 
      ? "LMS0001" 
      : "LMS" + (parseInt(latestBorrow[0].borrowId.replace("LMS", "")) + 1).toString().padStart(4, "0");

    const newBorrowData = req.body;
    const newBookArray = [];

    for (let i = 0; i < newBorrowData.borrowedBooks.length; i++) {
      const book = await Book.findOne({ bookId: newBorrowData.borrowedBooks[i].bookId });
      if (!book) {
        return res.status(404).json({ message: `Book with id ${newBorrowData.borrowedBooks[i].bookId} not found` });
      }

      newBookArray.push({
        name: book.bookName,
        id: book.bookId,
        image: book.images[0]
      });
    }

    newBorrowData.borrowedBooks = newBookArray;
    newBorrowData.borrowId = borrowId;
    newBorrowData.email = req.user.email;
    newBorrowData.borrowDate = new Date();
    newBorrowData.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 7 days later

    const borrow = new Borrow(newBorrowData);
    const savedBorrow = await borrow.save();

    res.json({ message: "Borrow created", borrow: savedBorrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getQuote(req, res) {
  try {
    const newBorrowData = req.body;
    const newBookArray = [];

    for (let i = 0; i < newBorrowData.borrowedBooks.length; i++) {
      const book = await Book.findOne({ bookId: newBorrowData.borrowedBooks[i].bookId });
      if (!book) {
        return res.status(404).json({
          message: `Book with id ${newBorrowData.borrowedBooks[i].bookId} not found`
        });
      }

      newBookArray.push({
        name: book.bookName,
        id: book.bookId,
        image: book.images[0]
      });
    }

    res.json({ borrowedBooks: newBookArray });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getBorrow(req, res) {
  
  try {
    if (isUser(req)) {
    const borrows = await Borrow.find({ email: req.user.email });

    res.json(borrows);
    return;
    }else if(isLibrarian(req)){
      const borrows = await Borrow.find({});

      res.json(borrows);
      return;
    }else{
      res.json({
        message: "Please login to view borrow details."
      })
    }
  } catch (error) {
      res.status(500).json({
          message: error.message,
      });
    }
  }

