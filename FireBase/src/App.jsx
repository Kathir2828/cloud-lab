import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";

function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // CRUD state
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState("");

  // 1. Listen for user login/logout state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. READ: Listen for real-time updates from "items" collection
  useEffect(() => {
    const itemsCollection = collection(db, "items");
    const unsubscribe = onSnapshot(itemsCollection, (snapshot) => {
      const docsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(docsList);
    });

    return () => unsubscribe();
  }, []);

  // --- AUTH FUNCTIONS ---
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signed up successfully!");
    } catch (err) {
      alert("Sign Up Error: " + err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Signed in successfully!");
    } catch (err) {
      alert("Sign In Error: " + err.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  // --- CRUD FUNCTIONS ---
  // CREATE
  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    try {
      await addDoc(collection(db, "items"), {
        name: newItemText,
        createdAt: new Date()
      });
      setNewItemText("");
    } catch (err) {
      alert("Add Error: " + err.message);
    }
  };

  // UPDATE
  const handleUpdateItem = async (id) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;
    try {
      const itemRef = doc(db, "items", id);
      await updateDoc(itemRef, { name: newName });
    } catch (err) {
      alert("Update Error: " + err.message);
    }
  };

  // DELETE
  const handleDeleteItem = async (id) => {
    try {
      const itemRef = doc(db, "items", id);
      await deleteDoc(itemRef);
    } catch (err) {
      alert("Delete Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Simple Firebase Auth & Firestore CRUD</h1>

      {/* SECTION 1: AUTHENTICATION */}
      <section style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        <h2>1. Authentication</h2>
        {user ? (
          <div>
            <p>Logged in as: <b>{user.email}</b></p>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {" "}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />
            <button onClick={handleSignUp}>Sign Up</button>
            {" "}
            <button onClick={handleSignIn}>Sign In</button>
          </div>
        )}
      </section>

      {/* SECTION 2: FIRESTORE CRUD */}
      <section style={{ border: "1px solid #ccc", padding: "10px" }}>
        <h2>2. Firestore CRUD (Items Collection)</h2>

        {/* CREATE */}
        <div>
          <input
            type="text"
            placeholder="Item name"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
          />
          {" "}
          <button onClick={handleAddItem}>Add Item</button>
        </div>

        {/* READ */}
        <h3>Items List:</h3>
        {items.length === 0 ? (
          <p>No items in database yet.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} style={{ marginBottom: "8px" }}>
                <span>{item.name}</span>
                {" "}
                {/* UPDATE */}
                <button onClick={() => handleUpdateItem(item.id)}>Edit</button>
                {" "}
                {/* DELETE */}
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
