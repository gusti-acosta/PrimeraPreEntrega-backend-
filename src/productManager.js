const fs = require('fs');

class ProductManager {
    static id = 0;

    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
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

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Todos los campos son obligatorios.');
            return;
        }

        const productAlfa = this.products.find(p => p.code === code);

        if (productAlfa !== undefined) {
            console.log('Este producto ya existe...');
            return;
        } else {
            ProductManager.id++;
            const newProduct = {
                id: ProductManager.id,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
            };
            this.products.push(newProduct);
            this.saveProducts();
        }
    }

    getProducts(limit) {
        if (!limit) {
            return this.products;
        } else {
            return this.products.slice(0, parseInt(limit));
        }
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (product !== undefined) {
            return product;
        } else {
            console.log('Producto no encontrado.');
            return;
        }
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(p => p.id === id);

        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
            this.saveProducts();
            console.log('Producto actualizado correctamente.');
        } else {
            console.log('Producto no encontrado.');
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

module.exports = { ProductManager };