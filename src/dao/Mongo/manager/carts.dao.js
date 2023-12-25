import BasicManager from "./basic.dao.js";
import { CartModel } from "../models/Cart.model.js";

export default class CartsManager extends BasicManager {
  constructor() {
    super(CartModel, 'products.product');
  }
  async createCart() {
    const newCart = { products: [] };
    const response = await this.createOne(newCart);
    return response;
  }

  async findCartById(idCart) {
    const cart = await this.findById(idCart);
    if (!cart) {
      return null;
    }
    const cartLenght = cart.products.length;
    const total = cart.products.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);
    return { cart, total ,cartLenght};
  }

  async addProductToCart(idCart, idProduct, quantity) {
    const cart = await CartModel.findById(idCart);
    const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === idProduct
    );

    if (productIndex === -1) {
        cart.products.push({ product: idProduct, quantity: quantity });
    } else {
        cart.products[productIndex].quantity += quantity;
    }

    return cart.save();
}


  async removeProductFromCart(idCart, idProduct) {
    const cart = await this.findById(idCart);
    if (!cart) {
      return null;
    }
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === idProduct
    );
    if (productIndex === -1) {
      return null;
    } else {
      cart.products.splice(productIndex, 1);
      await cart.save();
      return cart;
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await this.findById(cartId);
      if (!cart) {
        return null;
      }
      cart.products = updatedProducts;
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await this.findById(cartId);
      if (!cart) {
        return null;
      }
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        return null;
      }
      cart.products[productIndex].quantity = quantity;
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async deleteAllProducts(cartId) {
    try {
      const cart = await this.findById(cartId);
      if (!cart) {
        return null;
      }
      cart.products = [];
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }
}


