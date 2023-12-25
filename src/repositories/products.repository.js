import { ProductsManager } from "../dao/factory.js";

class ProductRepository {
  constructor() {
    this.dao = new ProductsManager();
  }

  async findAllCustom(query) {
    try {
      return await this.dao.findAllCustom(query);
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await this.dao.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async createOne(data) {
    try {
      return await this.dao.createOne(data);
    } catch (error) {
      throw error;
    }
  }

  async updatedOne(id, data) {
    try {
      const result = await this.dao.updatedOne(id, data);

      if (result.matchedCount > 0) {
        return true;
      } else {
        throw new Error('Producto no encontrado para actualizar');
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(id) {
    try {
      await this.dao.deleteOne(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export const productRepository = new ProductRepository();
