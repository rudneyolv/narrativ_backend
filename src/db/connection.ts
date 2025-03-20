import { Pool } from "pg";

const pool = new Pool({
  user: "rudney",
  host: "localhost",
  database: "narrativ_db",
  password: "your_password",
  port: 5432,
});

export const connect = async () => {
  try {
    const client = await pool.connect();
    console.log("📦 Conectado ao banco de dados");
    return client;
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    throw error;
  }
};

export default pool;
