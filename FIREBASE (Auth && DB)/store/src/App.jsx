
import { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPk2hshtbz1mf_Jo68vu6MkYugjYwKi08",
  authDomain: "mdirfan-982d5.firebaseapp.com",
  projectId: "mdirfan-982d5",
  storageBucket: "mdirfan-982d5.firebasestorage.app",
  messagingSenderId: "352880984129",
  appId: "1:352880984129:web:db32e4bb26fbb050ff46c0"
};

// Initialize Firebase
const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

const db = getFirestore(app);
const itemsRef = collection(db, "portfolio-items");

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // READ: Fetch data in real time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      itemsRef,
      (snapshot) => {
        setItems(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error(err);
        setError("Failed to fetch data. Check Firestore rules.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // CREATE and UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      setError("");

      if (editId) {
        // UPDATE existing document
        await updateDoc(doc(db, "portfolio-items", editId), {
          text: text.trim(),
          updatedAt: serverTimestamp()
        });

        setEditId(null);
      } else {
        // CREATE new document
        await addDoc(itemsRef, {
          text: text.trim(),
          createdAt: serverTimestamp()
        });
      }

      setText("");
    } catch (err) {
      console.error(err);
      setError("Failed to save data.");
    }
  };

  // Select an item to edit
  const handleEdit = (item) => {
    setText(item.text);
    setEditId(item.id);
    setError("");
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteDoc(doc(db, "portfolio-items", id));

      if (editId === id) {
        setEditId(null);
        setText("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete item.");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setText("");
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial"
    }}>
      <h2>Firestore CRUD Application</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter skill or item"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: "10px", width: "60%" }}
        />

        <button type="submit" style={{ marginLeft: "8px" }}>
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Saved Items</h3>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: "12px" }}>
              {item.text}{" "}

              <button onClick={() => handleEdit(item)}>
                Edit
              </button>{" "}

              <button onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
