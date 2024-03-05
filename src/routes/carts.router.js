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

cartsRouter.post('/', async (req, res) => {
    try {
        const response = await cartManager.newCart();
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear un nuevo carrito.');
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

module.exports = cartsRouter;

