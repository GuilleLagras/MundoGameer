import { messageService } from "../services/message.service.js";

class MessageController {
    async getAllMessages(req, res) {
      try {
        const messages = await messageService.getAllMessages();
        res.status(200).json({ messages });
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los mensajes.' });
      }
    }
  
    async getMessageById(req, res) {
      const messageId = req.params.id;
      try {
        const message = await messageService.getMessageById(messageId);
        if (message) {
          res.status(200).json({ message });
        } else {
          res.status(404).json({ error: 'Mensaje no encontrado.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener el mensaje.' });
      }
    }
  
    async createMessage(req, res) {
      const { email, message } = req.body;
      try {
        const newMessage = await messageService.createMessage(email, message);
        res.status(200).json({ message: 'Nuevo Mensaje', createdMessage: newMessage });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  
    async deleteMessageById(req, res) {
      const messageId = req.params.id;
      try {
        const isDeleted = await messageService.deleteMessageById(messageId);
        if (isDeleted) {
          res.status(200).json({ message: 'Mensaje eliminado correctamente' });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  }
  
  export const messageController = new MessageController();