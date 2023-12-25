import { TicketsModel } from '../models/Tickets.model.js'
import BasicManager from './basic.dao.js'
class TicketDao extends BasicManager{
    constructor() {
        super(TicketsModel,'');
      }
      //createOne lo recibe del basic 

}

export const ticketDao = new TicketDao()