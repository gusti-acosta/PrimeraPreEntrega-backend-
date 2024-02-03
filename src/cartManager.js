import fs from  'fs';

export class CartManager{
    static id = 0;
    constructor(){
        this.path = "src/card";
        this.carts = [];
    };
    getCarts = async () => {
        const response = await fs.readFile(this.path, 'utf8')
        const responseJSON = JSON.parse(response)
        return responseJSON;
    }
    getCartproducts = async (id) => {
        const carts = await this.getCarts();
        const cart = carts.filter((cart)=> cart.id === id);
        if(cart){
            return cart.products;
        }else {
            console.log('Carrito no encontrado');
        }
    }
    newCart = async () =>{
        const newId =  CartManager.id++;
        const newCart = {
            id:newId ,
            products:[],
        }
        this.carts = await this.getCarts()
        this.carts.push(newCart)
        await fs.writeFileSync(this.path, JSON.stringify(this.carts))
        return newCart;
    }
    addProductToCart = async (cardId, productId) => {
        const carts = await this.getCarts();
        const index = carts.findIndex((card)=> card.id === cardId );
        if(index != -1 ){        
            const cardProducts = await this.getCartproducts();
            const existingProducIndex = this.getCartproducts.findIndex(p=> p.productId === productId);
            if (existingProducIndex !== -1){
                cardProducts[existingProducIndex].quantity = this.getCartproducts[existingProducIndex].quantity + 1;
            }else{
                cardProducts.push({productId, quantity : 1})
            }

            carts[index].products = cardProducts;
            
            await fs.writeFileSync(this.path, JSON.stringify(carts));
            return {message:'Se agrego el producto al carro'};
        } else {
            console.log("No se encontro el carro");    
        }    
    }   
}

