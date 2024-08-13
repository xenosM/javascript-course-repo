export const cart = JSON.parse(localStorage.getItem('cart')) || []
// FUNCTIONS
export function saveToLocalStorage(){
    localStorage.setItem('cart',JSON.stringify(cart))
}
export function addToCart(button,event){
    const productId = button.dataset.productId;
    const selectedQuantity =event.target.closest('.product-container').querySelector('.product-quantity-select').value
    // const selectedQuantity = button.querySelector('.product-quantity-select').value
    let matchingItem;
    //check if there are same items in the cart
    cart.forEach((item)=>{
        if(item.productId == productId){
            matchingItem = item
        }   
    })
    //Condition if there is or isn't matching items 
    if (matchingItem){
        matchingItem.quantity+=parseInt(selectedQuantity);
    }
    else{
        cart.push({
            productId,
            quantity : parseInt(selectedQuantity),
            deliveryOptionId: '1'
        })
    }
    saveToLocalStorage();
}
export function removeFromCart(productId){
    cart.forEach((cartItem,index)=>{
        if(cartItem.productId == productId) cart.splice(index,1)
    })
    saveToLocalStorage();
}
export function updateCartQuantity(productId,newQuantity){
    cart.forEach((item)=>{
        if(item.productId == productId){
           item.quantity = newQuantity;
        }   
    })
    saveToLocalStorage();

}

export function updateDeliveryOption(productId,deliveryOptionId ){
    let matchingItem;
    cart.forEach((item)=>{
        if(item.productId == productId){
            matchingItem = item
        }   
    })
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToLocalStorage();
}

export function totalCartItem(){
    let totalQuantity =0;
  cart.forEach((item)=>{
     totalQuantity += item.quantity 
  })
  return totalQuantity;
}

export function loadCart(func){
    const xhr = new XMLHttpRequest();
  
    xhr.addEventListener('load',()=>{
      func();
      console.log('cart loaded')
    })
    
    xhr.open('GET','https://supersimplebackend.dev/cart')
    xhr.send()
  }
  