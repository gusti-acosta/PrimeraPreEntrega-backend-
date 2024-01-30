const express = requiere('express');
import { ProductManager } from "./productManager";
import { ProductsRouter } from "./routes/products.router.js";


PORT = 8080;

const app = express();


export const productManager = new ProductManager;


app.use('/products', productsRouter )
app.use(express.json())

app.lisyen(PORT, (req, res) => {
    console.log(`Servidor escuchando el puerto ${PORT}`);
})