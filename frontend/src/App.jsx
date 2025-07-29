import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from './context/ApiContext';
import { Link } from 'react-router-dom';

function App() {
  const apiUrl = useContext(ApiContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/tasks`)
      .then(res => res.json())
      .then(setTasks)
      .catch(console.error);
  }, [apiUrl]);

  const handleDelete = async (id) => {
    try {
      await fetch(`${apiUrl}/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "100vh",
      backgroundColor: "#1e1e1e",
      color: "#f0f0f0",
      fontFamily: "sans-serif",
      padding: "40px 20px"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "30px" }}>Liste des tâches</h1>

      <Link to="/task">
        <button style={buttonStyle}>Ajouter une tâche</button>
      </Link>

      <ul style={{ listStyle: "none", padding: 0, width: "100%", maxWidth: "600px", marginTop: "40px" }}>
        {tasks.length === 0 ? (
          <li style={{ textAlign: "center", fontSize: "1.2rem", opacity: 0.8 }}>Aucune tâche</li>
        ) : (
          tasks.map(task => (
            <li key={task.id} style={{
              background: "#2a2a2a",
              borderRadius: "8px",
              padding: "15px 20px",
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span>{task.title}</span>
              <div>
                <Link to={`/task/${task.id}`}>
                  <button style={{ ...buttonStyle, marginRight: "10px" }}>Modifier</button>
                </Link>
                <button
                  onClick={() => handleDelete(task.id)}
                  style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "background-color 0.2s",
};

export default App;
