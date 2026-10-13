
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://username:pass@cluster0.lqtj80y.mongodb.net/?appName=Cluster0")
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.log("MongoDB connection error:", err));


const Item = mongoose.model("Item", { name: String });




app.get("/items", async (req, res) => {
  res.json(await Item.find());
});

app.post("/items", async (req, res) => {
  res.json(await Item.create(req.body));
});

app.delete("/items/:id", async (req, res) => {
  res.json(await Item.findByIdAndDelete(req.params.id));
});

app.listen(5000, () => console.log("Server running on port 5000"));
