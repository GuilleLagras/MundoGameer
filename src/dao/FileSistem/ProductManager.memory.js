import { existsSync, promises } from 'fs';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            if (existsSync(this.path)) {
                const productsFile = await promises.readFile(this.path, 'utf-8');
                return JSON.parse(productsFile);
            } else {
                return [];
            }
        } catch (error) {
            throw error;
        }
    }

    async addProduct(title, description, price, category, code, stock , status = true, thumbnails = []) {
        try {
            if (!title || !description || isNaN(price) || !category || isNaN(stock) || !code  ) {
                throw new Error("Faltan datos del producto");
            }

            const products = await this.getProducts();
            const repeatedCode = products.some((product) => product.code === code);

            if (repeatedCode) {
                throw new Error('Ya existe un producto con el mismo código, inténtelo nuevamente');
            }

            let id;
            if (!products.length) {
                id = 1;
            } else {
                id = products[products.length - 1].id + 1;
            }

            // Crear el nuevo producto
            const newProduct = {
                id,
                title,
                description,
                price,
                category,
                stock,
                code,
                status,
                thumbnails: [thumbnails],
            };

            products.push(newProduct);

            await promises.writeFile(this.path, JSON.stringify(products));
        } catch (error) {
            throw error;
        }
    }

    async getProductById(pid) {
        try {
            console.log(`Valor de pid: ${pid}`);
            const products = await this.getProducts();
            const product = products.find((p) => p.id === pid);
            if (!product) {
                console.error("Producto no encontrado ...");
                return null;
            } else {
                return product;
            }
        } catch (error) {
            throw new Error(error, 'producto no encontrado');
        }
    }
    

    async updateProduct(id, updatedData) {
        try {
            const products = await this.getProducts();
            // Encontrar producto
            const productIndex = products.findIndex((p) => p.id === id);

            if (!productIndex) {
                console.error('Producto no encontrado');
                return;
            }
            // Actualizar producto
            const updatedProduct = { ...products[productIndex], ...updatedData };
            products[productIndex] = updatedProduct;

            await promises.writeFile(this.path, JSON.stringify(products));
            console.log('Producto se ha actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }

    async deleteProduct(id) {
        try {
            // Leer lista actual
            const products = await this.getProducts();

            // Encontrar el índice del producto a eliminar
            const productIndex = products.findIndex((p) => p.id === id);

            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
                return;
            }

            // Eliminar el producto del array
            products.splice(productIndex, 1);

            // Escribir la lista de productos actualizada
            await promises.writeFile(this.path, JSON.stringify(products));
            console.log('Producto eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }
}
