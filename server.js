import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/* LISTAR TODOS */
app.get("/produtos", async (req, res) => {
  const result = await pool.query("SELECT * FROM produtos ORDER BY produto");
  res.json(result.rows);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});


/* =========================
   CREATE - inserir produto
   ========================= */
app.post("/produtos", async (req, res) => {
  try {
    // 1️⃣ Dados que vêm do front-end (JSON)
    const { produto, quantidade } = req.body;

    // 2️⃣ Validação simples
    if (!produto || quantidade === undefined) {
      return res.status(400).json({
        erro: "Produto e quantidade são obrigatórios"
      });
    }

    // 3️⃣ Comando SQL (INSERT)
    const sql = `
      INSERT INTO produtos (produto, quantidade)
      VALUES ($1, $2)
      RETURNING *
    `;

    // 4️⃣ Executa o SQL no PostgreSQL
    const result = await pool.query(sql, [produto, quantidade]);

    // 5️⃣ Retorna o produto salvo
    res.status(201).json(result.rows[0]);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao inserir produto" });
  }
});
