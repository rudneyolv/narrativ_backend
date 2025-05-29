/** @format */

import pool from "../db/connection";
import { UserWithProfileProps } from "../interfaces/users.interfaces";
import { usersRepository } from "../repositories/users.repository";

const usersRepositoryInstance = new usersRepository();

export class userService {
  public async fetchWithProfileByUsername(username: string): Promise<UserWithProfileProps | null> {
    try {
      const user: UserWithProfileProps | null =
        await usersRepositoryInstance.findWithProfileByUsername(username);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
