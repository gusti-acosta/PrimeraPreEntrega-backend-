const { v4: uuidv4 } = require('uuid');
const productModel = require("../models/product"); // Importar el modelo de producto de Mongoose

class ProductManager {
    async addProduct(productData) {
        try {
            const { title, description, price, thumbnail, code = uuidv4(), stock = 1, status = true, category } = productData;

            const productExists = await productModel.exists({ title });

            if (productExists) {
                console.log('Este producto ya existe...');
                return;
            } else {
                const newProduct = new productModel({
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    code: code,
                    stock: stock,
                    status: status,
                    category: category,
                });

                await productModel.create(newProduct);
                console.log('Producto agregado correctamente.');
            }
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    }

    async getProducts(limit) {
        try {
            let products;
            if (limit === undefined) {
                products = await productModel.find().lean();
            } else {
                products = await productModel.find().limit(parseInt(limit)).lean();
            }
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error.message);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id).lean();
            if (product !== null) {
                return product;
            } else {
                console.log('Producto no encontrado.');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener producto por ID:', error.message);
            return null;
        }
    }

    async updateProduct(id, newData) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(id, newData, { new: true }).lean();
            if (updatedProduct !== null) {
                console.log('Producto actualizado correctamente.');
                return updatedProduct;
            } else {
                console.log('Producto no encontrado.');
                return null;
            }
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id).lean();
            if (deletedProduct !== null) {
                console.log('Producto eliminado correctamente.');
                return deletedProduct;
            } else {
                console.log('Producto no encontrado.');
                return null;
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            return null;
        }
    }
}

module.exports = ProductManager;

