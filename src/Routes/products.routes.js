import { Router } from 'express';
import { productController } from '../controllers/products.controller.js';

const productsRouter = Router();

productsRouter.get('/', productController.getAllProducts);
productsRouter.get('/:pid', productController.getProductById);
productsRouter.post('/', productController.createProduct);
productsRouter.put('/:pid', productController.updateProductById);
productsRouter.delete('/:pid', productController.deleteProductById);

export default productsRouter;
