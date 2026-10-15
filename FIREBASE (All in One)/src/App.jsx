import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
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
    const unsubscribe = onSnapshot(
      itemsCollection,
      (snapshot) => {
        const docsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(docsList);
      },
      (error) => {
        console.error("Firestore snapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // --- AUTH FUNCTIONS ---
  // A. Email/Password Sign Up (requires "Email/Password" provider enabled in Console)
  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      alert("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      alert("Signed up successfully!");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/operation-not-allowed" || err.code === "auth/configuration-not-found") {
        alert(
          "Sign Up Error: 'Email/Password' provider is NOT enabled in your Firebase Console!\n\n" +
          "• Enabling 'Google / Gmail' login does not enable typing custom email/passwords.\n" +
          "• To fix this: Go to Firebase Console -> Authentication -> Sign-in method, click 'Email/Password' and Enable it.\n" +
          "• OR use the 'Sign in with Google' button below!"
        );
      } else {
        alert("Sign Up Error: " + err.message);
      }
    }
  };

  // B. Email/Password Sign In
  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      alert("Please enter both email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      alert("Signed in successfully!");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/operation-not-allowed" || err.code === "auth/configuration-not-found") {
        alert(
          "Sign In Error: 'Email/Password' provider is NOT enabled in your Firebase Console!\n\n" +
          "• Enabling 'Google / Gmail' login does not enable typing custom email/passwords.\n" +
          "• To fix this: Go to Firebase Console -> Authentication -> Sign-in method, click 'Email/Password' and Enable it.\n" +
          "• OR use the 'Sign in with Google' button below!"
        );
      } else {
        alert("Sign In Error: " + err.message);
      }
    }
  };

  // C. Google (Gmail) Sign In (uses the Google provider you enabled in Firebase Console)
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Signed in with Google successfully!");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/operation-not-allowed") {
        alert("Google sign-in is not enabled in Firebase Console. Go to Authentication -> Sign-in method -> Google and click Enable.");
      } else if (err.code === "auth/popup-closed-by-user") {
        // Popup was closed before completion, ignore or notify
      } else {
        alert("Google Sign In Error: " + err.message);
      }
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
            <p>Logged in as: <b>{user.displayName ? `${user.displayName} (${user.email})` : user.email}</b></p>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div>
            <p><b>Option 1: Email &amp; Password</b> <small>(Requires 'Email/Password' provider enabled in Firebase Console)</small></p>
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

            <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px dashed #ccc" }}>
              <p><b>Option 2: Google / Gmail Sign In</b> <small>(Uses the Google provider you enabled)</small></p>
              <button
                onClick={handleGoogleSignIn}
                style={{
                  backgroundColor: "#4285F4",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Sign In with Google (Gmail)
              </button>
            </div>
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
