import { Router } from 'express';
import { productManager } from '../app.js';

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    const { limit } = req.query;
    try {
        const products = productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        console.log("Error getting products: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
productsRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = productManager.getProductById(id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.log("Error getting product by id: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status = true, category } = req.body;
        productManager.addProduct(title, description, price, thumbnail, code, stock, status, category);
        res.json({ message: "Product added successfully" });
    } catch (error) {
        console.log("Error adding product: ", error);
        res.status(400).json({ error: "Invalid data" });
    }
});
productsRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        const response = await productManager.updateProduct(id, { title, description, price, thumbnail, code, stock, status, category });
        if (response) {
            res.json({ message: "Product updated successfully" });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.log("Error updating product: ", error);
        res.status(400).json({ error: "Cannot update this product" });
    }
});

productsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await productManager.deleteProduct(id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error deleting product: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export { productsRouter };
