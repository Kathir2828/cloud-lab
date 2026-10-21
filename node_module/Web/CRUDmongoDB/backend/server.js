const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dns = require('dns'); // Changed from 'import' to 'require'
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://admin123:admin123@cluster0.oxindb7.mongodb.net/");

const User = mongoose.model('User', {
  id: String,
  name: String,
});

app.get("/user/:id", async (req, res) => {
  res.json(await User.findOne({ id: req.params.id }));
});

app.get("/user", async (req, res) => {
  res.json(await User.find());
});

app.post("/user", async (req, res) => {
  let newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});

app.put("/user/:id", async (req, res) => {
  let x = await User.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );
  res.json(x);
});

app.delete("/user/:id", async (req, res) => {
  await User.findOneAndDelete({ id: req.params.id });
  res.json({ success: true });
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});