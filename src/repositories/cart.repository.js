import {CartsManager} from "../dao/factory.js";

class CartsRepository {
  constructor() {
    this.dao = new CartsManager()
  }

  async findAll() {
    return this.dao.findAll();
  }

  async findCartById(id) {
    return this.dao.findCartById(id);
  }

  async createCart() {
    return this.dao.createCart();
  }

  async addProductToCart(idCart, idProduct, quantity) {
    return this.dao.addProductToCart(idCart, idProduct, quantity);
  }

  async deleteAllProducts(idCart) {
    return this.dao.deleteAllProducts(idCart);
  }

  async removeProductFromCart(idCart, idProduct) {
    return this.dao.removeProductFromCart(idCart, idProduct);
  }

  async updateCart(idCart, updatedProducts) {
    return this.dao.updateCart(idCart, updatedProducts);
  }

  async updateProductQuantity(idCart, idProduct, quantity) {
    return this.dao.updateProductQuantity(idCart, idProduct, quantity);
  }
}

export const cartsRepository = new CartsRepository()
