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
            const newCart = await cartModel.create({ products: [] , quantity: []});
            return newCart;
        } catch (error) {
            console.error('Error al crear nuevo carrito:', error.message);
            return null;
        }
    }
    

    async addProductToCart(cartId, productId, quantity) {
        try {
            if (!quantity) {
                quantity = 1;
            }
    
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
    
    
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (cart) {
                cart.products = cart.products.filter(item => item.product !== productId);
                await cart.save();
            } else {
                console.log("No se encontró el carrito");
                return null;
            }
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error.message);
            return null;
        }
    }
    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (cart) {
                const existingProduct = cart.products.find(p => p.product === productId);
                if (existingProduct) {
                    existingProduct.quantity = newQuantity;
                    await cart.save();
                    return { message: 'Se actualizó la cantidad del producto en el carrito.' };
                } else {
                    return { message: 'El producto no está en el carrito.' };
                }
            } else {
                console.log("No se encontró el carrito");
                return null;
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error.message);
            return null;
        }
    } 
    async removeAllProductsFromCart(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (cart) {
                cart.products = [];
                await cart.save();
                return { message: 'Todos los productos fueron eliminados del carrito.' };
            } else {
                console.log("No se encontró el carrito");
                return null;
            }
        } catch (error) {
            console.error('Error al eliminar todos los productos del carrito:', error.message);
            return null;
        }
    }   
}



module.exports = CartManager;