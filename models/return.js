import mongoose from "mongoose";

const returnSchema = mongoose.Schema({
  returnId: {
    type: String,
    required: true,
    unique: true,
  },
  borrowId: {
    type: String,
    required: true,
  },
  returnDate: {
    type: Date,
    default: Date.now,
  },
  fine: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
    required: true,
  },
});

const Return = mongoose.model("returns", returnSchema);

export default Return;
