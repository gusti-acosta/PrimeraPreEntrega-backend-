const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const productManager = require('./dao/dbManagers/productsManager.js');
const CartManager = require('./dao/dbManagers/CartManager.js');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const messageModel = require('./dao/models/message.js')

const PORT = 8080;
const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb+srv://gustavoacosta3308:naZs5KCAshPBkhtC@cluster0.grtrbvh.mongodb.net/ecommerce')
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(error => console.error('Error al conectarse a MongoDB Atlas:', error));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Configuración de Socket.io
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando el puerto ${PORT}`);
});
const io = new Server(server);

// Middleware para pasar req.io a las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Instancias de los managers
const manager = new productManager(__dirname + '/products.json');
const cartManager = new CartManager();

// Manejadores de conexiones de socket.io
io.on('connection', async (socket) => {
    console.log('Socket conectado');

    socket.on('new product', async (newProduct) => {
        console.log('Nuevo producto recibido:', newProduct);
        await manager.addProduct(newProduct);
        const products = await manager.getProducts();
        io.emit('list updated', { products });
        console.log('Lista de productos actualizada:', products);
    });

    socket.on('delete product', async ({ id }) => {
        await manager.deleteProduct(id);
        const products = await manager.getProducts();
        io.emit('list updated', { products });
    });
    const messages = await messageModel.find().lean()
    socket.emit('chat messages', {messages})

    socket.on('new message', async (messageInfo)=>{
        await messageModel.create(messageInfo)
        const messages = await messageModel.find().lean()
        io.emit('chat messages', {messages})
    }) 
});

// Middlewares
app.use(express.json());
app.use(express.static('public'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
