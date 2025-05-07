/** @format */

import { Pool } from "pg";

const pool = new Pool({
  user: "rudney",
  host: "localhost",
  database: "narrativ_db",
  password: "your_password",
  port: 5432,
});

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 2 segundos

export const connect = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const client = await pool.connect();
      console.log("📦 Conectado ao banco de dados");
      return client;
    } catch (error) {
      console.error(`❌ Erro na tentativa ${attempt}:`, error);
      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Tentando novamente em ${RETRY_DELAY / 1000}s...`);
        await new Promise((res) => setTimeout(res, RETRY_DELAY));
      } else {
        console.error("❌ Todas as tentativas de conexão falharam.");
        throw error;
      }
    }
  }
};

export default pool;
