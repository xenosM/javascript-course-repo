class Cart{
    #localStorageKey ;
    constructor(localStorageKey){
        this.#localStorageKey = localStorageKey
    };
    
    cartItems = JSON.parse(localStorage.getItem(this.localStorageKey)) || [];

    saveToLocalStorage(){
    localStorage.setItem(this.#localStorageKey,JSON.stringify(this.cartItems))
    };

    addToCart(button,event){
        const productId = button.dataset.productId;
        const selectedQuantity =event.target.closest('.product-container').querySelector('.product-quantity-select').value
        // const selectedQuantity = button.querySelector('.product-quantity-select').value
        let matchingItem;
        //check if there are same items in the cart
        this.cartItems.forEach((item)=>{
            if(item.productId == productId){
                matchingItem = item
            }   
        })
        //Condition if there is or isn't matching items 
        if (matchingItem){
            matchingItem.quantity+=parseInt(selectedQuantity);
        }
        else{
            this.cartItems.push({
                productId,
                quantity : parseInt(selectedQuantity),
                deliveryOptionId: '1'
            })
        }
        this.saveToLocalStorage();
    };

    removeFromCart(productId){
        this.cartItems.forEach((cartItem,index)=>{
            if(cartItem.productId == productId) this.cartItem.splice(index,1)
        })
        this.saveToLocalStorage();
    };
    updateCartQuantity(productId,newQuantity){
        this.cartItems.forEach((item)=>{
            if(item.productId == productId){
                item.quantity = newQuantity;
            }   
        })
        this.saveToLocalStorage();

    };
    updateDeliveryOption(productId,deliveryOptionId ){
        let matchingItem;
        this.cartItems.forEach((item)=>{
            if(item.productId == productId){
                matchingItem = item
            }   
        })
        matchingItem.deliveryOptionId = deliveryOptionId;
        this.saveToLocalStorage();
    };

    totalCartItem(){
        let totalQuantity =0;
        this.cartItems.forEach((item)=>{
        totalQuantity += item.quantity 
        })
        return totalQuantity;
    }
}


const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');



//CONSOLE
console.log(cart)
console.log(businessCart)