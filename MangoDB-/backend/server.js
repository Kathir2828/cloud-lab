
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://admin123:admin123@cluster0.lqtj80y.mongodb.net/")
  .then(async () => {
    console.log("Connected to MongoDB Atlas!");
    // Seed 4 initial records if empty
    const count = await Book.countDocuments();
    if (count === 0) {
      await Book.insertMany([
        { id: "1", name: "The Great Gatsby", author: "F. Scott Fitzgerald", review: "Classic masterpiece" },
        { id: "2", name: "To Kill a Mockingbird", author: "Harper Lee", review: "Must read story" },
        { id: "3", name: "1984", author: "George Orwell", review: "Dystopian classic" },
        { id: "4", name: "Pride and Prejudice", author: "Jane Austen", review: "Timeless novel" },
      ]);
      console.log("Seeded 4 initial book records!");
    }
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// Schema with 4 fields: (id, name, author, review)
const Book = mongoose.model("Book", {
  id: String,
  name: String,
  author: String,
  review: String,
});

// 1. GET - Fetch all books
app.get(["/books", "/items"], async (req, res) => {
  try {
    res.json(await Book.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ADD - Insert a new book
app.post(["/books", "/items"], async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    console.log("\n==============================");
    console.log("📥 Added new book to MongoDB:", newBook);
    const allBooks = await Book.find();
    console.log("📊 Full Database Records now:", allBooks);
    console.log("==============================\n");
    res.json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. UPDATE - Only change the name
app.put(["/books/:id", "/items/:id"], async (req, res) => {
  try {
    let updated = await Book.findOneAndUpdate(
      { id: req.params.id },
      { name: req.body.name },
      { new: true }
    );
    if (!updated && mongoose.Types.ObjectId.isValid(req.params.id)) {
      updated = await Book.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
      );
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. DELETE - Delete a book
app.delete(["/books/:id", "/items/:id"], async (req, res) => {
  try {
    let deleted = await Book.findOneAndDelete({ id: req.params.id });
    if (!deleted && mongoose.Types.ObjectId.isValid(req.params.id)) {
      deleted = await Book.findByIdAndDelete(req.params.id);
    }
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
