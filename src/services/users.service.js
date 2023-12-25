
import { usersRepository } from "../repositories/users.repository.js";

class UsersService {
  async findByEmail(email) {
    try {
      return await usersRepository.findByEmail(email);
    } catch (error) {
      console.error("Error en al encontrar email", error);
      throw error;
    }
  }

}


export const usersService = new UsersService();
