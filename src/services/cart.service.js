import { ticketDao } from "../dao/Mongo/manager/Tickets.dao.js";

import { v4 as uuidv4 } from 'uuid';

import { cartsRepository } from "../repositories/cart.repository.js";
import { usersRepository } from "../repositories/users.repository.js";
class CartsService {
  async getAllCarts() {
    
    try {
      const carts = await cartsRepository.findAll();
      return { message: "Carritos :", carts };
    } catch (error) {
      throw new Error("Error al obtener los Carts");
    }
  }

  async getCartById(idCart) {
    try {
      const cart = await cartsRepository.findCartById(idCart);
      if (!cart) {
        return { message: "Carrito no encontrado" };
      }
      return { cart };
    } catch (error) {
      throw new Error("Error al buscar carrito");
    }
  }

  async createCart() {
    try {
      const createdCart = await cartsRepository.createCart();
      return { message: "Carrito creado correctamente", Cart: createdCart };
    } catch (error) {
      throw new Error("Error al crear carrito");
    }
  }

  async addProductToCart(idCart, idProduct, quantity) {
    try {
      const cart = await cartsRepository.addProductToCart(idCart, idProduct, quantity);
      return { cart };
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  }

  async removeAllProducts(idCart) {
    try {
      const updatedCart = await cartsRepository.deleteAllProducts(idCart);
      return { message: "Se ha vaciado el carrito", updatedCart };
    } catch (error) {
      throw new Error("Error vaciando carrito");
    }
  }

  async removeProductFromCart(idCart, idProduct) {
    try {
      const updatedCart = await cartsRepository.removeProductFromCart(idCart, idProduct);
      if (!updatedCart) {
        return { message: "Producto no encontrado" };
      }
      return updatedCart;
    } catch (error) {
      throw new Error("Error eliminando producto del carrito");
    }
  }

  async updateCart(idCart, updatedProducts) {
    try {
      const updatedCart = await cartsRepository.updateCart(idCart, updatedProducts);
      if (!updatedCart) {
        return { message: "Carrito no encontrado" };
      }
      return updatedCart;
    } catch (error) {
      throw new Error("Error actualizando carrito");
    }
  }

  async updateProductQuantity(idCart, idProduct, quantity) {
    try {
      const updatedCart = await cartsRepository.updateProductQuantity(idCart, idProduct, quantity);
      if (!updatedCart) {
        return { message: "Carrito o Producto no encontrado" };
      }
      return updatedCart;
    } catch (error) {
      throw new Error("Error al actualizar carrito");
    }
  }

  async purchase(idCart, userEmail, userToken) {
    
        const { email, cartId } = userToken;

        if (cartId !== idCart) {
            throw new Error("El ID del carrito en el token no coincide con el ID proporcionado");
        }

        const user = await usersRepository.findByEmailAndPopulateOrders(userEmail)
        const { cart, total, cartLength } = await cartsRepository.findCartById(idCart);

        if (cart === null) {
            console.log("Error al recuperar carrito ")
            throw new Error("El carrito no se ha recuperado correctamente");
            
          }

        const products = cart.products;
        console.log("Products:", products);

        let availableProducts = [];
        let unavailableProducts = [];

        for (let item of products) {
            if (item.product.stock >= item.quantity) {
                availableProducts.push(item);
                item.product.stock -= item.quantity;
                await item.product.save();
            } else {
                unavailableProducts.push(item);
            }
        }

        cart.products = unavailableProducts;
        await cart.save();

        if (availableProducts.length) {
            const ticket = {
                code: uuidv4(),
                amount: total,
                purchase_datetime: new Date(),
                purchaser: email,
            };

        const createdTicket = await ticketDao.createOne(ticket);

      if (createdTicket && createdTicket._id) {
        user.orders.push(createdTicket._id.toString());
        await user.save();
      } else {
          console.error("El _id de la orden es undefined");
      }
      return {
        success: true,
        availableProducts,
        total,
        message: 'Compra exitosa',
        unavailableProducts,
    };
} else {
    return {
        success: false,
        message: 'No se pudieron comprar los productos seleccionados',
        unavailableProducts,
    };
}
}

}

export const cartsService = new CartsService();
