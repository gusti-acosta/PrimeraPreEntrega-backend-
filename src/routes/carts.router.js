const { Router } = require("express");
const CartManager = require("../dao/dbManagers/CartManager");

const cartsRouter = Router();
const cartManager = new CartManager(); 

cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los carritos.');
    }
});
cartsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartProducts = await cartManager.getCartById(cartId); // Obtener los productos del carrito
        res.render('cart', { products: cartProducts }); // Renderizar la vista 'cart' y pasar los productos
    } catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
        res.status(500).send('Error al obtener los productos del carrito.');
    }
});
cartsRouter.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < await Product.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        results.products = await Product.find().limit(limit).skip(startIndex).exec();
        res.render('products', { products: results.products, pagination: results });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos.');
    }
});

cartsRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await cartManager.getCartById(id);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el carrito por ID.');
    }
});

cartsRouter.post('/', async (req, res) => {
    try {
        const response = await cartManager.newCart();
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear un nuevo carrito.');
    }
});



cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(cid, pid);
        res.send('Producto agregado correctamente.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar producto al carrito.');
    }
});
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        if (quantity !== undefined && typeof quantity === 'number') {
            await cartManager.updateProductQuantity(cid, pid, quantity);
            res.send('Cantidad del producto actualizada correctamente.');
        } else {
            res.status(400).send('La cantidad debe ser un número válido.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la cantidad del producto en el carrito.');
    }
});
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.removeProductFromCart(cid, pid);
        res.send('Producto eliminado del carrito correctamente.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar producto del carrito.');
    }
});
cartsRouter.delete('/:cid/products', async (req, res) => {
    const { cid } = req.params;
    try {
        await cartManager.removeAllProductsFromCart(cid);
        res.send('Todos los productos fueron eliminados del carrito correctamente.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar todos los productos del carrito.');
    }
});


module.exports = cartsRouter;

