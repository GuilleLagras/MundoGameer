
import BasicManager from "./basic.dao.js";
import { productsModel } from "../models/Product.model.js";

export default class ProductManager extends BasicManager {
  constructor() {
    super(productsModel, ''); 
}

    async findAllCustom(obj) {
        try {

            const { limit = 10, page = 1, sort = '', query = '', availability = '' } = obj;

            const filter = {};
        
            if (query) {
              filter.category = query;
            }
            if (availability === 'available') {
              filter.stock = { $gt: 0 };
            } else if (availability === 'outOfStock') {
              filter.stock = 0;
            }
        
            const sortOptions = {};
        
            if (sort) {
              if (sort === 'asc') {
                sortOptions.price = 1;
              } else if (sort === 'desc') {
                sortOptions.price = -1;
              }
            }
        
            const result = await productsModel.paginate(filter, {
              limit,
              page,
              sort: sortOptions,
            });
        
            const info = {
              status: 'success',
              payload: result.docs,
              totalPages: result.totalPages,
              prevPage: result.hasPrevPage ? result.prevPage : null,
              nextPage: result.hasNextPage ? result.nextPage : null,
              page: page,
              hasPrevPage: result.hasPrevPage,
              hasNextPage: result.hasNextPage,
              prevLink: result.hasPrevPage
                ? `/api/products?page=${result.prevPage}&query=${query}&availability=${availability}&sort=${sort}`
                : null,
              nextLink: result.hasNextPage
                ? `/api/products?page=${result.nextPage}&query=${query}&availability=${availability}&sort=${sort}`
                : null,
            }
        return { info, result:result.docs };
    } catch (error) {

        throw error;
    }
    }

    async updatedOne(id, obj) {
        const result = await productsModel.updateOne({ _id: id }, obj);
        return result; 
    }
    
}




   /* async findAll(){
    const result = await productsModel.find().lean();
    return result
    }*/
    //Aca no usar el find de basic