const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

/* =========================
   CREATE - cadastrar produto
   ========================= */
app.post('/produtos', async (req, res) => {
  const { produto, quantidade } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO produtos (produto, quantidade) VALUES ($1, $2) RETURNING *',
      [produto, quantidade]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* =========================
   READ - listar todos
   ========================= */
app.get('/produtos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* =========================
   READ - buscar por nome
   ========================= */
app.get('/produtos/busca/nome', async (req, res) => {
  const { produto } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM produtos WHERE produto ILIKE $1',
      [`%${produto}%`]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* =========================
   READ - buscar por quantidade
   ========================= */
app.get('/produtos/busca/quantidade', async (req, res) => {
  const { quantidade } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM produtos WHERE quantidade = $1',
      [quantidade]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* =========================
   UPDATE - editar produto
   ========================= */
app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { produto, quantidade } = req.body;

  try {
    const result = await pool.query(
      'UPDATE produtos SET produto = $1, quantidade = $2 WHERE id = $3 RETURNING *',
      [produto, quantidade, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* =========================
   DELETE - remover produto
   ========================= */
app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      'DELETE FROM produtos WHERE id = $1',
      [id]
    );

    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* =========================
   Servidor
   ========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});

