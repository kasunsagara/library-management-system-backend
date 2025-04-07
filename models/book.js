import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    bookId: {
        type: String,
        required: true,
        unique: true        
    },
    bookName: {
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    authorName: {
        type: String,
        required: true
    },
    publishedDate: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const Book = mongoose.model("book", bookSchema);

export default Book;


    