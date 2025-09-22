import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    chatWindowRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setChatHistory((prev) => [...prev, { sender: "user", text: inputText }]);
    setLoading(true);

    try {
      const response = await fetch("http://163.125.102.142:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputText })
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const botResponse = data.insights || "No insights available.";

      setChatHistory((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [...prev, { sender: "bot", text: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
      setInputText("");
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatWindow}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: chat.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: chat.sender === "user" ? "#d1f0d1" : "#e6f7ff"
            }}
          >
            <strong>{chat.sender === "user" ? "You" : "AI"}:</strong> {chat.text}
          </div>
        ))}
        <div ref={chatWindowRef} />
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask AI about production insights..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  chatContainer: { width: "100%", maxWidth: "400px", margin: "0 auto", border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" },
  chatWindow: { height: "400px", overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "10px", background: "#f9f9f9" },
  message: { padding: "8px", borderRadius: "8px", maxWidth: "80%", wordWrap: "break-word" },
  form: { display: "flex", borderTop: "1px solid #ccc" },
  input: { flex: 1, padding: "10px", border: "none", outline: "none" },
  button: { padding: "10px 15px", border: "none", cursor: "pointer", background: "#007bff", color: "white" }
};

export default Chatbot;
