import { Router } from 'express';
import { messageController } from '../controllers/message.controller.js';

const messageRouter = Router();


messageRouter.get('/', messageController.getAllMessages);
messageRouter.get('/:id', messageController.getMessageById);
messageRouter.post('/', messageController.createMessage);
messageRouter.delete('/:id', messageController.deleteMessageById);


export default messageRouter;
