const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors'); // ✅ garde uniquement ça

const app = express();

app.use(cors());             // ✅ mets cors avant les routes
app.use(express.json());     // ✅ ensuite express.json()

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

app.get('/tasks', async (_, res) => {
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute('SELECT * FROM tasks');
  res.json(rows);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Le titre est obligatoire" });
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('INSERT INTO tasks (title) VALUES (?)', [title]);
  res.sendStatus(201);
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('DELETE FROM tasks WHERE id=?', [id]);
  res.sendStatus(200);
});

app.put('/tasks/:id', async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('UPDATE tasks SET title=? WHERE id=?', [title, id]);
  res.sendStatus(200);
});

app.listen(4000, () => console.log("API listening on port 4000"));
