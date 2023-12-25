import {messageRepository} from "../repositories/message.repository.js";

class MessageService {
  async getAllMessages() {
    try {
      return await messageRepository.getAllMessages();
    } catch (error) {
      throw error;
    }
  }

  async getMessageById(id) {
    try {
      return await messageRepository.getMessageById(id);
    } catch (error) {
      throw error;
    }
  }

  async createMessage(email, message) {
    try {
      return await messageRepository.createMessage(email, message);
    } catch (error) {
      throw error;
    }
  }

  async deleteMessageById(id) {
    try {
      const result = await messageRepository.deleteMessageById(id);
      if (result) {
        return true;
      } else {
        throw new Error('Mensaje no encontrado para eliminar');
      }
    } catch (error) {
      throw error;
    }
  }
}

export const messageService = new MessageService();
