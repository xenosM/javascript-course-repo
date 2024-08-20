import { products,loadProducts } from "../data/products.js";
import { orders,getDeliveryDate } from "./orders.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import { updateCartIcon } from "./amazon.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'


const url = new URL (window.location.href);
const productId = url.searchParams.get('productId')
const orderId = url.searchParams.get('order')
let matchingOrder ;
let matchingProduct;
let matchingDeliveryOption;
let matchingOrderItem;
let orderItemQuantity;
//matching Order
function getMatchingOrder(){
    orders.forEach(orderObject=>{
      
        if(orderObject.id == orderId.trim()){
            matchingOrder = orderObject;
        }
    })
}

//matching product
function getMatchingProduct(){
    products.forEach(productItem =>{
        if(productItem.id == productId){
            matchingProduct = productItem;
        }
    })
}
//matching delivery option
function getMatchingDeliveryOption(){
        deliveryOptions.forEach(option =>{
            if(option.id == matchingOrderItem.deliveryOptionId){
                console.log('delivery match found!!!');
                matchingDeliveryOption = option;
            }
    })
}
//matching order item
function getMatchingOrderItem(){
    matchingOrder.order.forEach(orderItem=>{
        if(orderItem.productId == matchingProduct.id){
            matchingOrderItem= orderItem;
        }
        })
}
//get product quantity
function getQuantity(){
            orderItemQuantity = matchingOrderItem.quantity;
}
//

function renderTracking(){
    let trackingHtml=''
    getMatchingProduct()
    getMatchingOrder()
    getMatchingOrderItem()
    getMatchingDeliveryOption()
    getQuantity()
    updateCartIcon()
    let deliveryDate= getDeliveryDate(matchingOrder.date,matchingDeliveryOption.deliveryDays)
    const percentProgress = ((dayjs()-dayjs(matchingOrder.date))/(dayjs(deliveryDate)-dayjs(matchingOrder.date)))*100;
    trackingHtml=`
    <div class="order-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${dayjs(deliveryDate).format('MMMM D')}
        </div>

        <div class="product-info">
         ${matchingProduct.name}
        </div>

        <div class="product-info">
          Quantity:${orderItemQuantity} 
        </div>

        <img class="product-image" src="${matchingProduct.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${percentProgress<50?'current-status':''}" >
            Preparing
          </div>
          <div class="progress-label ${percentProgress>=50 &&percentProgress<100?'current-status':''}">
            Shipped
          </div>
          <div class="progress-label ${percentProgress>=100?'current-status':''}">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width:${percentProgress}%"></div>
        </div>
      </div>
    `
    document.querySelector('.main').innerHTML = trackingHtml;
    //end loading
    document.querySelector('.loader').style.display = 'none'
}

//code
new Promise((resolve)=>{
    loadProducts(()=>{
        resolve()
    })
})
.then(()=>{
 renderTracking()
})