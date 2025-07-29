import { useContext, useState, useEffect } from 'react';
import { ApiContext } from '../context/ApiContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import React from 'react';

function TaskForm() {
  const apiUrl = useContext(ApiContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`${apiUrl}/tasks/${id}`)
        .then(res => res.json())
        .then(data => setTitle(data.title))
        .catch(console.error);
    }
  }, [id, apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = id ? "PUT" : "POST";
    const url = id ? `${apiUrl}/tasks/${id}` : `${apiUrl}/tasks`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    setMessage(id ? "Tâche modifiée avec succès !" : "Tâche ajoutée avec succès !");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      backgroundColor: "#1e1e1e",
      color: "#f0f0f0"
    }}>
      <div style={{
        backgroundColor: "#2c2c2c",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: 500
      }}>
        <Link to="/">
          <button style={{
            backgroundColor: "#444",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            cursor: "pointer",
            marginBottom: 20
          }}>Retour à la liste</button>
        </Link>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <h2 style={{ marginBottom: 20, textAlign: "center" }}>{id ? "Modifier" : "Ajouter"} une tâche</h2>
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #555",
              backgroundColor: "#1e1e1e",
              color: "#fff",
              marginBottom: 20
            }}
          />
          <button type="submit" style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#4caf50",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold"
          }}>
            {id ? "Modifier" : "Ajouter"}
          </button>
        </form>

        {message && <p style={{ color: "green", marginTop: 20, textAlign: "center" }}>{message}</p>}
      </div>
    </div>
  );
}

export default TaskForm;
