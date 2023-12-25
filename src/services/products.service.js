import { productRepository } from "../repositories/products.repository.js";
class ProductService {
  async getAllProducts(query) {
    try {
      return await productRepository.findAllCustom(query);
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      return await productRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async createProduct(data) {
    try {
      return await productRepository.createOne(data);
    } catch (error) {
      throw error;
    }
  }

  async updateProductById(id, data) {
    try {
      const result = await productRepository.updatedOne(id, data);

      if (result.matchedCount > 0) {
        return true; 
      } else {
        throw new Error('Producto no encontrado para actualizar');
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteProductById(id) {
    try {
      await productRepository.deleteOne(id);
      return true; 
    } catch (error) {
      throw error;
    }
  }
}

export const productService = new ProductService();
