import { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  // 1. GET
  const getItems = () => {
    fetch("http://localhost:5000/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  };

  useEffect(() => {
    getItems();
  }, []);

  // 2. INSERT
  const addItem = () => {
    fetch("http://localhost:5000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then(() => {
      setName("");
      getItems();
    });
  };

  // 3. DELETE
  const deleteItem = (id) => {
    fetch(`http://localhost:5000/items/${id}`, {
      method: "DELETE",
    }).then(() => getItems());
  };

  return (
    <div>
      <h2>MongoDB CRUD</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button onClick={addItem}>Insert</button>

      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name}{" "}
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
