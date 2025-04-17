/** @format */

import pool from "../db/connection";

export class userRepository {
  public async findByEmail(email: string) {
    if (typeof email !== "string") {
      throw new Error("error.expected_an_string");
    }

    const query = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  public async findByUsername(username: string) {
    if (typeof username !== "string") {
      throw new Error("error.expected_an_string");
    }

    const query = `SELECT * FROM users where username = $1 LIMIT 1`;

    const result = await pool.query(query, [username]);
    return result.rows[0] || null;
  }
}
