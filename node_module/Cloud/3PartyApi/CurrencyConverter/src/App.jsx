import { useState } from "react";

function App() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [result, setResult] = useState(null);

  const apiKey = "04bf98bb519146dbded9dccd";

  const convertCurrency = async () => {
    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`
      );
      const data = await res.json();
      if (data.result === "success") {
        const rate = data.conversion_rates[to];
        if (rate) {
          setResult((amount * rate).toFixed(2));
        } else {
          alert("Target currency not found");
        }
      } else {
        alert(data["error-type"] || "Failed to fetch exchange rates");
      }
    } catch (err) {
      alert("Error fetching exchange rate");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Currency Converter (3rd Party API)</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {" "}
      <input
        type="text"
        placeholder="From (e.g. USD)"
        value={from}
        onChange={(e) => setFrom(e.target.value.toUpperCase())}
      />
      {" to "}
      <input
        type="text"
        placeholder="To (e.g. INR)"
        value={to}
        onChange={(e) => setTo(e.target.value.toUpperCase())}
      />
      {" "}
      <button onClick={convertCurrency}>Convert</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>
            Result: {amount} {from} = {result} {to}
          </h3>
        </div>
      )}
    </div>
  );
}

export default App;
