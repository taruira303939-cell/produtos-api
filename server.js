import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/* CADASTRAR VINHO */
app.post("/produtos", async (req, res) => {
  const { produto, quantidade, } = req.body;

  const result = await pool.query(
    "INSERT INTO produtos (produto, quantidade) VALUES ($1,$2) RETURNING *",
    [produto, quantidade]
  );

  res.json(result.rows[0]);
});

/* LISTAR TODOS */
app.get("/produtos", async (req, res) => {
  const result = await pool.query("SELECT * FROM produtos ORDER BY produto");
  res.json(result.rows);
});


/*editar*/
app.put("/produtos/:id", async (req, res) => {
  const { produto, quantidade } = req.body;

  await pool.query(
    `
    UPDATE produtos SET
      produto = COALESCE($1, produto),
      quantidade = COALESCE($2, quantidade)
    WHERE id = $3
    `,
    [produto, quantidade, req.params.id]
  );

  res.sendStatus(200);
});


/*excluir*/
app.delete("/produtos/:id", async (req, res) => {
  await pool.query("DELETE FROM produtos WHERE id=$1", [req.params.id]);
  res.sendStatus(200);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});