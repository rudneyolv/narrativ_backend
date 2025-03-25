import pool from "../db/connection";

export class authRepository {
  public async insertUser(user: any): Promise<any> {
    if (Array.isArray(user)) {
      throw new Error("Expected an array of values");
    }

    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await pool.query(query, user);
    return result;
  }

  public async checkIfEmailExists(email: string): Promise<boolean> {
    const query = `SELECT 1 FROM Users WHERE email = $1 LIMIT 1`;
    const result = await pool.query(query, [email]);
    return (result as any)?.rowCount > 0;
  }

  public async checkIfUsernameExists(username: string): Promise<boolean> {
    const query = `SELECT 1 FROM Users WHERE username = $1 LIMIT 1`;
    const result = await pool.query(query, [username]);
    return (result as any)?.rowCount > 0;
  }
}
