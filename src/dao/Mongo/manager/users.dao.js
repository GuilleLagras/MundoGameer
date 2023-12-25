import BasicManager from './basic.dao.js';
import { UserModel } from '../models/Users.model.js';

export default class UsersManager extends BasicManager {
    constructor() {
        super(UserModel, ''); 
    }
    //findById y createOne heredados
    async findByEmail(email){
        try{
        const response = await  UserModel.findOne({email});
        return response;
    } catch (error) {
            console.error("Error en findByEmail:", error);
            throw error;
        }
    }
    async findByEmailAndPopulateOrders(email){
        try{
        const response = await  UserModel.findOne({email}).populate('orders');
        return response;
    } catch (error) {
            console.error("Error en findByEmail:", error);
            throw error;
        }
    }

}
