import { deliveryOptions } from "../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { products,loadProducts } from "../data/products.js";
import { updateCartIcon } from "./amazon.js";
import { cart,saveToLocalStorage } from "../data/cart.js";

export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order){
    import('./checkout.js')
    .then((checkout)=>{
        const orderObject = {
            id:getRandomHex(),
            date : dayjs(),
            order,
            totalPrice : checkout.totalPrice,
            date: dayjs()
        }
        orders.unshift(orderObject);
        saveToStorage();
    })
}

function saveToStorage(){
    localStorage.setItem('orders', JSON.stringify(orders))
}
export function getDeliveryDate(todayDate,numberOfDays){
    const date = dayjs(todayDate)
    const deliveryDate = date.add(numberOfDays,'day')
    return deliveryDate;
}
function getRandomHex(){
    const randomHex=[];
    const hexValues= ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    
    for(let i=0;i<3;i++){
         const tempHex= [];
         let tempValue;
         for(let j=0; j<getRandomNumber();j++){
             tempHex.push(hexValues[Math.floor(Math.random()*16)])
            tempValue=  tempHex.join('');
         }
         randomHex.push(tempValue)
    }
    return randomHex.join('-')
}

function getRandomNumber(){
    let randomNumber=0
    while(randomNumber<=4){
         randomNumber = Math.ceil(Math.random()*12)
    }
    return randomNumber
}

function renderOrders(){
    console.log('render start')
    let orderContainerHtml = '';
    let orderHtml ='';
    let orderContainerHtmlList='';
    let matchingItem ;
    let matchingDelivery;

    orders.forEach(orderObject => {
        orderObject.order.forEach(orderItem =>{
            products.forEach((product)=>{
                if(product.id === orderItem.productId){
                   console.log("product match found");
                    matchingItem = product;
                }
            })
            deliveryOptions.forEach(option =>{
                if(option.id == orderItem.deliveryOptionId){
                    console.log('delivery match found');
                    matchingDelivery = option;
                }
            })
            orderHtml +=`
              
                    <div class="product-image-container">
                    <img src="${matchingItem.image}">
                    </div>
    
                    <div class="product-details">
                    <div class="product-name">
                        ${matchingItem.name }
                    </div>
                    <div class="product-delivery-date">
                        Arriving on: ${dayjs(getDeliveryDate(orderObject.date,matchingDelivery.deliveryDays)).format('MMMM D')}
                    </div>
                    <div class="product-quantity">
                        Quantity: ${orderItem.quantity}
                    </div>
                    <button data-product-id =${matchingItem.id} data-quantity =${orderItem.quantity} class="buy-again-button button-primary">
                        <img class="buy-again-icon" src="images/icons/buy-again.png">
                        <span class="buy-again-message">Buy it again</span>
                    </button>
                    </div>
    
                    <div class="product-actions">
                    <a href=" tracking.html?order= ${orderObject.id}&productId=${matchingItem.id}"  >
                        <button class="track-package-button button-secondary">
                        Track package
                        </button>
                    </a>
                    </div>
            `
        })
        orderContainerHtml=`
        <div class="order-container"> <div class="order-header">
        <div class="order-header-left-section">
        <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${dayjs(orderObject.date).format('MMMM D')}</div>
        </div>
        <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${orderObject.totalPrice}</div>
        </div>
        </div>

        <div class="order-header-right-section">
        <div class="order-header-label">Order ID:</div>
        <div>${orderObject.id}</div>
        </div>
        </div>
        <div class="order-details-grid">
        ${orderHtml}
        </div>
        </div>
        `
        orderContainerHtmlList+=orderContainerHtml;
        orderHtml=''
        orderContainerHtml=''
    });
    document.querySelector('.orders-grid').innerHTML = orderContainerHtmlList;
   //end loading
    document.querySelector('.loader').style.display = 'none'
    console.log('render end')
}
//BUY AGAIN BUTTON
function setBuyBtn(){
    console.log( document.querySelectorAll('.buy-again-button '));
    document.querySelectorAll('.buy-again-button ').forEach((button)=>{
            button.onclick = ()=>{
                console.log('click');
                const productId = button.dataset.productId;
                const quantity = parseInt(button.dataset.quantity)
                let matchingItem;
                cart.forEach((item)=>{
                    if(item.productId == productId){
                        matchingItem = item
                    }   
                })
                //Condition if there is or isn't matching items 
                if (matchingItem){
                    matchingItem.quantity+=parseInt(quantity);
                }
                else{
                    cart.push({
                        productId,
                        quantity ,
                        deliveryOptionId: '1'
                    })
                }
            saveToLocalStorage();
            updateCartIcon();
            }
        })

}
// CODE
    new Promise((resolve)=>{
        loadProducts(()=>{
            resolve()
        })
        updateCartIcon();
    })
    .then(()=>{
        renderOrders()
        setBuyBtn();
    })
    