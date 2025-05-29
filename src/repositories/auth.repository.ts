/** @format */

import pool from "../db/connection";
import { insertUserProps, PrivateUser } from "../interfaces/auth.interfaces";

export class authRepository {
  public async insertUser(userData: insertUserProps): Promise<PrivateUser> {
    const { username, email, hashed_password } = userData;

    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [username, email, hashed_password];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  public async findUserWithPasswordByEmail(email: string): Promise<PrivateUser | null> {
    const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }
}
