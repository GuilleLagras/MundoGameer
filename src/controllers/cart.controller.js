import {cartsService} from "../services/cart.service.js";

class CartsController {
  async getAllCarts(req, res) {
    try {
      const result = await cartsService.getAllCarts();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCartById(req, res) {
    try {
      const { idCart } = req.params;
      const result = await cartsService.getCartById(idCart);
      res.status(result.cart ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createCart(req, res) {
    try {
      const result = await cartsService.createCart();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { idCart, idProduct } = req.params;
      const { quantity } = req.body;
      const result = await cartsService.addProductToCart(idCart, idProduct, quantity);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeAllProducts(req, res) {
    try {
      const { idCart } = req.params;
      const result = await cartsService.removeAllProducts(idCart);
      res.status(result.updatedCart ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const { idCart, idProduct } = req.params;
      const result = await cartsService.removeProductFromCart(idCart, idProduct);
      res.status(result.updatedCart ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const { idCart } = req.params;
      const updatedProducts = req.body;
      const result = await cartsService.updateCart(idCart, updatedProducts);
      res.status(result ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { idCart, idProduct } = req.params;
      const { quantity } = req.body;
      const result = await cartsService.updateProductQuantity(idCart, idProduct, quantity);
      res.status(result ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const cartsController = new CartsController();
