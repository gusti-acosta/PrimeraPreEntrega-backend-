import { Router } from "express";
import { ProductManager, productManager } from "../app";
const productsRouter = Router()

productsRouter.get('./pid', async (req, res) =>{
    const {pid} = req.params;
    try {
        const products = productManager.getProductById(pid)
        res.json(products)
    } catch (error){
        console.log("Error getting product by id: ", error);
    }
})

productsRouter.post('/', async (req, res) =>{
    try {
        const { tile, description, price, thumbnail, code, stock, status, category } = req.body;
        const response = await productManager.addProduct({ tile,description,price,thumbnail,code,stock,status,category});
        res.json(response)
    } catch(error){
        return res.status(400).send({error:"Invalid data"});
    }
})
productsRouter.put('/:pid', async (req, res) =>{
    const {pid} = req.params;
    try{
        const { tile, description, price, thumbnail, code, stock, status, category } = req.body;
        const response = await productManager.addProduct(id, { tile,description,price,thumbnail,code,stock,status,category});
    }catch(error){
        return res.status(400).send({error:'Cannot update this product'})
    }
})

export { produtsRouter }