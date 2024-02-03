import { json } from 'express';
import fs from 'fs';

class ProductManager {
    static id = 0;

    constructor() {
        this.path = 'src/products.json';
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                const maxId = Math.max(...this.products.map(product => product.id));
                ProductManager.id = maxId;
            }
        } catch (error) {
            console.error('Error al cargar productos:', error.message);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar productos:', error.message);
        }
    }

    addProduct(title, description, price, thumbnail, code, stock, status, category  ) {
        ProductManager.id++;
        const newProduct = {
            id: ProductManager.id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            status: status,
            category: category
        };

        this.products.push(newProduct);
        this.saveProducts();
    }

    getProducts(limit) {
        if (limit === undefined) {
            return this.products;
        } else {
            return this.products.slice(0, parseInt(limit));
        }
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id == id);
        if (product !== undefined) {
            return product;
        } else {
            console.log('Producto no encontrado.');
            return null;
        }
    }

    updateProduct = async (id, { ...data }) => {
        const productIndex = this.products.findIndex(p => p.id == id);
    
        if (productIndex !== -1) {
            this.products[productIndex] = { id, ...data };
            await this.saveProducts();
            return this.products[productIndex];
        } else {
            console.log('Producto no encontrado.');
            return null;
        }
    }
    
    

    deleteProduct(id) {
        const productIndex = this.products.findIndex(p => p.id === id);

        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            this.saveProducts();
            console.log('Producto eliminado correctamente.');
        } else {
            console.log('Producto no encontrado.');
        }
    }
}

export { ProductManager };
