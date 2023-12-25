import {existsSync , promises} from 'fs';
import { ProductManager } from './ProductManager.memory.js';
import __dirname from '../../utils.js';

const productManager = new ProductManager(`${__dirname}../../Products.JSON`)
export class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }
// obtener carritos
  async getCarts() {
    try {
      if (existsSync(this.path)) {
        const cartsFile = await promises.readFile(this.path, 'utf-8');
        return JSON.parse(cartsFile);
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al leer archivo', error);
      throw error;
    }
  }
// crear carritos
  async createCart() {
    try {
      const carts = await this.getCarts();
      let id;
      if (!carts.length) {
        id = 1;
      } else {
        id = carts[carts.length - 1].id + 1;
      }
      const newCart = { id, products: [] };
      carts.push(newCart);
      await promises.writeFile(this.path, JSON.stringify(carts));
      return newCart;
    } catch (error) {
      console.error('Error al crear carrito', error);
      throw error;
    }
  }
// obtener carrito por id
  async getCartById(cid) {
    try{
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cid);

    return cart
    } catch{
      throw new Error ('no se encontro carrito con ese id')
    }
  } 
  // agregar al carrito
  async addProductToCart(cid, pid, quantity = 1) {
    try {
      const carts = await this.getCarts();
  
      const cartIndex = carts.findIndex((c) => c.id === cid);
  
      if (cartIndex === -1) {
        throw new Error("No existe ese carrito");
      }
  
      const product = await productManager.getProductById(pid);
  
      if (!product) {
        throw new Error("No existe un producto con ese id");
      }
  
      const cart = carts[cartIndex];
  
      const productIndex = cart.products.findIndex((p) => p.id === pid);
  
      if (productIndex === -1) {
        const newProduct = { id: pid, quantity: 1 };
        cart.products.push(newProduct);
      } else {
        cart.products[productIndex].quantity += quantity;
      }
  
      await promises.writeFile(this.path, JSON.stringify(carts));
  
      return cart;
    } catch (error) {
      console.error("Error al agregar el producto al carrito", error);
      throw error;
    }
  }
  
  

// eliminar un producto del carrito
async removeProductFromCart(cid, pid) {
  try {

    const cart = await this.getCartById(cid);

    if (!cart) {
      throw new Error("No existe ese carrito");
    }

    const productIndex = cart.products.findIndex((p) => p.id === pid);

    if (productIndex === -1) {
      throw new Error("No existe un producto con ese id en el carrito");
      
    }

    cart.products.splice(productIndex, 1);

    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((c) => c.id === cid);

    if (cartIndex !== -1) {
      carts[cartIndex] = cart;
      await promises.writeFile(this.path, JSON.stringify(carts));
    }

    return cart;
  } catch (error) {
    console.error("Error al eliminar producto del carrito ", error);
  }
}
}