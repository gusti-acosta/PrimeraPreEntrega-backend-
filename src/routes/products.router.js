const { Router } = require("express");
const productManager = require("../dao/dbManagers/productsManager");

const manager = new productManager();

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const skip = (page - 1) * limit;
    try {
        let products;
        let count;

        // Construye el filtro según el parámetro query
        const filter = query ? { category: query } : {};

        // Realiza el conteo total de productos
        count = await manager.countProducts(filter);

        // Realiza la búsqueda de productos con los filtros y opciones de paginación
        if (sort === 'asc') {
            products = await manager.getProducts(filter, limit, skip, 'price');
        } else if (sort === 'desc') {
            products = await manager.getProducts(filter, limit, skip, '-price');
        } else {
            products = await manager.getProducts(filter, limit, skip);
        }

        // Calcula el total de páginas
        const totalPages = Math.ceil(count / limit);

        // Genera los enlaces para la página anterior y siguiente
        const prevLink = page > 1 ? `/api/products?limit=${limit}&page=${parseInt(page) - 1}` : null;
        const nextLink = page < totalPages ? `/api/products?limit=${limit}&page=${parseInt(page) + 1}` : null;

        // Prepara el objeto de respuesta
        const response = {
            status: 'success',
            payload: products,
            totalPages: totalPages,
            prevPage: parseInt(page) - 1,
            nextPage: parseInt(page) + 1,
            page: page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: prevLink,
            nextLink: nextLink
        };

        res.json(response);
    } catch (error) {
        console.log("Error getting products: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


productsRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await manager.getProductById(id);
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
        const productData = req.body;
        await manager.addProduct(productData);
        const products = await manager.getProducts();
        req.io.emit('list updated', { products });
        console.log(products)
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
        const response = await manager.updateProduct(id, { title, description, price, thumbnail, code, stock, status, category });
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
        await manager.deleteProduct(id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error deleting product: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = productsRouter;
