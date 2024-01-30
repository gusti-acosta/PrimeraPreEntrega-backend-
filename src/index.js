const { ProductManager } = require("./productManager"); 

const manager = new ProductManager('./products.json');
async function cargarArchivos() {
    try {
        await manager.addProduct('ps5', 'xcdvxscscjkajkcajkjkdjkdjahjkdj', 599.99, 'image.jpg', 'FP1', 10);
        await manager.addProduct('ps6', 'jdashjkdajhksdhjksasdjhkjkah', 22229.99, 'imagen.jpg', 'SP2', 20);

        const products = await manager.getAllProducts();
        console.log(products);
        
        await new Promise(resolve => setTimeout(resolve, 10000));

        await manager.deleteProduct(1);
    } catch (error) {
        console.error('Error al cargar archivos:', error.message);
    }
}

cargarArchivos();
