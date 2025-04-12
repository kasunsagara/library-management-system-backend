import mongoose from "mongoose";

const borrowSchema = mongoose.Schema({
    borrowId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    borrowedBooks: [
        {
            name: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            }
        }
    ],
    borrowDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});

const Borrow = mongoose.model("borrows", borrowSchema);

export default Borrow;


