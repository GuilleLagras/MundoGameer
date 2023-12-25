import { productService } from "../services/products.service.js";

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts(req.query);
      res.status(200).json({
        status: 'success',
        payload: products.result,
        totalPages: products.info.totalPages,
        prevPage: products.info.prev,
        nextPage: products.info.next,
        page: products.info.page,
        hasPrevPage: products.info.hasPrevPage,
        hasNextPage: products.info.hasNextPage,
        prevLink: products.info.prevLink,
        nextLink: products.info.nextLink,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos.' });
    }
  }

  async getProductById(req, res) {
    const productId = req.params.pid;
    try {
      const product = await productService.getProductById(productId);
      if (product) {
        res.status(200).json({ message: 'Producto encontrado', product });
      } else {
        res.status(404).json({ error: 'Producto no encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto.' });
    }
  }

  async createProduct(req, res) {
    try {
      const createdProduct = await productService.createProduct(req.body);
      res.status(200).json({ message: 'Producto agregado correctamente', product: createdProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProductById(req, res) {
    const productId = req.params.pid;

    try {
      const updatedData = req.body;
      const isUpdated = await productService.updateProductById(productId, updatedData);

      if (isUpdated) {
        res.status(200).json({ message: 'Producto actualizado correctamente' });
      } else {
        res.status(404).json({ error: 'Producto no encontrado para actualizar' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProductById(req, res) {
    const productId = req.params.pid;

    try {
      const isDeleted = await productService.deleteProductById(productId);

      if (isDeleted) {
        res.json({ message: 'Producto eliminado correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const productController = new ProductController();
