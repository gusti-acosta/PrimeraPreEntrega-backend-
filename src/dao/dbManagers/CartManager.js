const cartModel = require("../models/cart"); 

class CartManager {
    async getCarts() {
        try {
            const carts = await cartModel.find().lean();
            return carts;
        } catch (error) {
            console.error('Error al obtener carritos:', error.message);
            return [];
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await cartModel.findById(cartId).lean();
            if (cart) {
                return cart.products;
            } else {
                console.log('Carrito no encontrado');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener carrito por ID:', error.message);
            return null;
        }
    }

    async newCart() {
        try {
            const newCart = await cartModel.create({ products: [] });
            return newCart;
        } catch (error) {
            console.error('Error al crear nuevo carrito:', error.message);
            return null;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (cart) {
                const existingProductIndex = cart.products.findIndex(p => p.product === productId);
                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += quantity;
                } else {
                    cart.products.push({ product: productId, quantity: quantity });
                }
                await cart.save();
                return { message: 'Se agregó el producto al carro' };
            } else {
                console.log("No se encontró el carrito");
                return null;
            }
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error.message);
            return null;
        }
    }
}


module.exports = CartManager;