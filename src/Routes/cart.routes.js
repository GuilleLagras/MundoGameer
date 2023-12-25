import { Router } from "express";
import { cartsController } from "../controllers/cart.controller.js";

const cartsRouter = Router();

cartsRouter.get("/", cartsController.getAllCarts);
cartsRouter.get("/:idCart", cartsController.getCartById);
cartsRouter.post("/", cartsController.createCart);
cartsRouter.post("/:idCart/products/:idProduct", cartsController.addProductToCart);
cartsRouter.delete("/:idCart", cartsController.removeAllProducts);
cartsRouter.delete("/:idCart/products/:idProduct", cartsController.removeProductFromCart);
cartsRouter.put("/:idCart", cartsController.updateCart);
cartsRouter.put("/:idCart/products/:idProduct", cartsController.updateProductQuantity);


export default cartsRouter;
