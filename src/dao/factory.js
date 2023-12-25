import config from "../config/config.js";

const persistence = config.persistence;

let UsersManager;
let CartsManager;
let ProductsManager;
let MessagesManager;

switch (persistence) {
    case 'Mongo':
        console.log('Trabajando con MongoDB');
        const mongoose = await import('mongoose');
        await mongoose.connect(config.mongo_uri);

        UsersManager = (await import('./Mongo/manager/users.dao.js')).default;
        CartsManager = (await import('./Mongo/manager/carts.dao.js')).default;
        ProductsManager = (await import('./Mongo/manager/products.dao.js')).default;
        MessagesManager = (await import('./Mongo/manager/message.dao.js')).default;
        break;
    case 'Memory':
        console.log('Trabajando con Memoria');
        //agregar persistencias memory
        break;
    default:
        console.error('Persistencia no válida en la configuración.');
        break;
}

export {
    UsersManager,
    CartsManager,
    ProductsManager,
    MessagesManager
};
