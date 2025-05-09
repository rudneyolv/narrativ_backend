/** @format */

import pool from "../db/connection";
import { UserProps } from "../interfaces/users.interfaces";

export class authRepository {
  public async insertUser(user: any): Promise<any> {
    if (!Array.isArray(user)) {
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

  public async findUserWithPasswordByEmail(email: string): Promise<UserProps | null> {
    const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }
}
