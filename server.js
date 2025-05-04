const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database('./hospital.db');

app.use(express.json());
app.use(express.static('public'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS visitantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data TEXT NOT NULL,
    turno TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS acompanhantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data TEXT NOT NULL,
    turno TEXT NOT NULL
  )`);
});

app.get('/api/visitantes', (req, res) => {
  const { data } = req.query;
  db.all("SELECT * FROM visitantes WHERE data = ?", [data], (err, rows) => {
    res.json(rows);
  });
});

app.post('/api/visitantes', (req, res) => {
  const { nome, data, turno } = req.body;
  db.get("SELECT COUNT(*) as count FROM visitantes WHERE data = ? AND turno = ?", [data, turno], (err, row) => {
    if (row.count >= 3) return res.status(400).json({ error: "Limite de visitantes para esse turno atingido." });
    db.run("INSERT INTO visitantes (nome, data, turno) VALUES (?, ?, ?)", [nome, data, turno], function(err) {
      res.json({ id: this.lastID });
    });
  });
});

app.put('/api/visitantes/:id', (req, res) => {
  const { nome } = req.body;
  db.run("UPDATE visitantes SET nome = ? WHERE id = ?", [nome, req.params.id], function(err) {
    res.json({ updated: this.changes });
  });
});

app.delete('/api/visitantes/:id', (req, res) => {
  db.run("DELETE FROM visitantes WHERE id = ?", [req.params.id], function(err) {
    res.json({ deleted: this.changes });
  });
});

app.get('/api/acompanhantes', (req, res) => {
  const { data } = req.query;
  db.all("SELECT * FROM acompanhantes WHERE data = ?", [data], (err, rows) => {
    res.json(rows);
  });
});

app.post('/api/acompanhantes', (req, res) => {
  const { nome, data, turno } = req.body;
  db.get("SELECT COUNT(*) as count FROM acompanhantes WHERE data = ? AND turno = ?", [data, turno], (err, row) => {
    if (row.count >= 1) return res.status(400).json({ error: "Já existe acompanhante para esse turno." });
    db.run("INSERT INTO acompanhantes (nome, data, turno) VALUES (?, ?, ?)", [nome, data, turno], function(err) {
      res.json({ id: this.lastID });
    });
  });
});

app.put('/api/acompanhantes/:id', (req, res) => {
  const { nome } = req.body;
  db.run("UPDATE acompanhantes SET nome = ? WHERE id = ?", [nome, req.params.id], function(err) {
    res.json({ updated: this.changes });
  });
});

app.delete('/api/acompanhantes/:id', (req, res) => {
  db.run("DELETE FROM acompanhantes WHERE id = ?", [req.params.id], function(err) {
    res.json({ deleted: this.changes });
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});