const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

let items = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" }
];

app.get("/", (req, res) => {
  res.send("Simple Backend Server is running! Test endpoints using Postman.");
});

app.get("/items", (req, res) => {
  res.json(items);
});

app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

app.post("/items", (req, res) => {
  const newItem = {
    id: items.length ? items[items.length - 1].id + 1 : 1,
    name: req.body.name
  };
  items.push(newItem);
  res.status(201).json({ message: "Item created successfully", data: newItem });
});

app.put("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Item not found" });
  item.name = req.body.name || item.name;
  res.json({ message: "Item updated successfully", data: item });
});

app.delete("/items/:id", (req, res) => {
  const itemIndex = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });
  const deletedItem = items.splice(itemIndex, 1);
  res.json({ message: "Item deleted successfully", data: deletedItem[0] });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
