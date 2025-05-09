/** @format */

import pool from "../db/connection";
import { usersRepository } from "../repositories/users.repository";

const usersRepositoryInstance = new usersRepository();

export class userService {
  public async fetchByUsername(username: string) {
    try {
      const user = await usersRepositoryInstance.findFullProfileByUsername(username);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
