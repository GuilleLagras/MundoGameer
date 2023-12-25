import { MessagesManager } from "../dao/factory.js";

class MessageRepository {
  constructor() {
    this.dao = new MessagesManager();
  }

  async getAllMessages() {
    try {
      return await this.dao.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getMessageById(id) {
    try {
      return await this.dao.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async createMessage(email, message) {
    try {
      return await this.dao.createOne(email, message);
    } catch (error) {
      throw error;
    }
  }

  async deleteMessageById(id) {
    try {
      const result = await this.dao.deleteOne(id);
      if (result.deletedCount > 0) {
        return true;
      } else {
        throw new Error('Mensaje no encontrado para eliminar');
      }
    } catch (error) {
      throw error;
    }
  }
}

export const messageRepository = new MessageRepository();
