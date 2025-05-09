/** @format */

import pool from "../db/connection";
import { UserProps, UserWithProfileProps } from "../interfaces/users.interfaces";

export class usersRepository {
  public async findByEmail(email: string): Promise<UserProps | null> {
    const query = `
      SELECT u.username, u.status
      FROM users u
      WHERE email = $1 
      LIMIT 1
    `;

    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  public async findByUsername(username: string): Promise<UserProps | null> {
    const query = `
      SELECT u.username, u.status
      FROM users u
      WHERE username = $1 
      LIMIT 1
    `;

    const result = await pool.query(query, [username]);
    return result.rows[0] || null;
  }

  public async findFullProfileByUsername(username: string): Promise<UserWithProfileProps | null> {
    const query = `
    SELECT 
      u.username, 
      u.status,
      up.profile_image_url,
      up.profile_banner_url
    FROM users u
    LEFT JOIN users_profiles up ON up.user_id = u.id
    WHERE u.username = $1
    LIMIT 1;
  `;
    const result = await pool.query<UserWithProfileProps>(query, [username]);

    return result.rows[0] || null;
  }
}
