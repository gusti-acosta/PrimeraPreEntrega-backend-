const { Router } = require("express");
const router = Router();
const  productManager = require("../dao/dbManagers/productsManager");

const manager = new productManager(__dirname+'/../products.json')


router.get('/', async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.render('home', { products }); // Pasar los datos de los productos a la plantilla
    } catch (error) {
        console.log("Error getting products: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/realtimeproducts',async (req, res) => {
    const products = await manager.getProducts();
    res.render('realTimeProducts', {products})
    
})
router.get('/chat',(req,res)=>{
    try{
        res.render( 'chat', {} );
    }catch{
        console.log(err);
    }
})
router.get('/products', async (req, res) => {
    try {
        // Lógica para obtener los datos necesarios para la vista de productos
        const products = await manager.getProducts();
        // Renderizar la vista de productos
        res.render('products', { products });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});



module.exports = router;
