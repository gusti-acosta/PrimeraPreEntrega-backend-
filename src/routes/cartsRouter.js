import { Router } from "express";
import { CartManager } from "../cartManager.js";
import { cartManager } from "../app.js";

const cartsRouter = Router()

cartsRouter.post('/', async (req, res) => {
    try {
        const response = await cartManager.newCart();
        res.json(response)
    }catch {
        res.status(500).send('Server error.')
    }
}) 

cartsRouter.get('/:id', async(req, res) => {
    const id = req.params;
    try {
        const response = await cartManager.getCartproducts(id);
        res.json(response);
    }catch {
        res.send('Error al intentar enviar los productos al carrito.')
    }
})

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params;
    try{
        await cartManager.addProductToCart(cid, pid)
        res.send('Producto agregado correctamente.')
    }catch {
        res.send('Erro al intentar guardar producto en el carrito.')
    }
})

export {cartsRouter}