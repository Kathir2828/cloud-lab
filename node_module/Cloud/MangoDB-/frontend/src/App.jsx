import { useState, useEffect } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [review, setReview] = useState("");

  // 1. GET (Read all books)
  const getBooks = () => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBooks();
  }, []);

  // 2. ADD (Insert new book with 4 fields)
  const addBook = () => {
    if (!id || !name || !author || !review) {
      alert("Please enter ID, Name, Author, and Review");
      return;
    }
    fetch("http://localhost:5000/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, author, review }),
    }).then(() => {
      setId("");
      setName("");
      setAuthor("");
      setReview("");
      getBooks();
    });
  };

  // 3. UPDATE (Only change the name)
  const updateBook = (bookId) => {
    const newName = prompt("Enter new book name:");
    if (!newName) return;

    fetch(`http://localhost:5000/books/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    }).then(() => getBooks());
  };

  // 4. DELETE (Remove book)
  const deleteBook = (bookId) => {
    fetch(`http://localhost:5000/books/${bookId}`, {
      method: "DELETE",
    }).then(() => getBooks());
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Library Management System</h2>

      {/* Input Form for 4 fields */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Book ID"
          style={{ marginRight: "8px", padding: "6px" }}
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Book Name"
          style={{ marginRight: "8px", padding: "6px" }}
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          style={{ marginRight: "8px", padding: "6px" }}
        />
        <input
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Review"
          style={{ marginRight: "8px", padding: "6px" }}
        />
        <button onClick={addBook} style={{ padding: "6px 12px" }}>
          Add Book
        </button>
      </div>

      {/* Book Records Table */}
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", maxWidth: "800px" }}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Author</th>
            <th>Review</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No books found.
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book._id || book.id}>
                <td>{book.id}</td>
                <td>{book.name}</td>
                <td>{book.author}</td>
                <td>{book.review}</td>
                <td>
                  <button
                    onClick={() => updateBook(book.id || book._id)}
                    style={{ marginRight: "6px" }}
                  >
                    Update Name
                  </button>
                  <button onClick={() => deleteBook(book.id || book._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
