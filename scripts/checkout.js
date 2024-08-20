import {cart, removeFromCart,updateCartQuantity, totalCartItem,updateDeliveryOption,loadCart} from '../data/cart.js'
import {products,loadProducts} from '../data/products.js'
import { updateCartIcon } from './amazon.js'
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import {deliveryOptions} from '../data/deliveryOptions.js'
// import { addOrder } from '../data/orders.js'
// import '../data/backend-practice.js'
// import '../data/cart-class.js'

export let totalPrice;
//FUNCTION FOR RENDERING CART LIST
function renderCheckout(){
  let productList = ''
  cart.forEach((cartItem)=>{
      const productId = cartItem.productId;
      let matchingItem;
      products.forEach((product)=>{
          if(product.id == productId) matchingItem = product;
      });
      let deliveryDate;
      deliveryOptions.forEach((deliveryOption)=>{
        if(deliveryOption.id == cartItem.deliveryOptionId ){
          const todayDate = dayjs();
          const addedDate = todayDate.add(deliveryOption.deliveryDays,'days')
          deliveryDate = addedDate.format('dddd, MMMM D')
        }
  
      })
  
      productList +=`
      <div class="cart-item-container"  data-id ="${matchingItem.id}">
        <div class="delivery-date">
          Delivery date: ${deliveryDate}
        </div>
  
        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingItem.image}">
  
          <div class="cart-item-details">
            <div class="product-name">
            ${matchingItem.name}
            </div>
            <div class="product-price">
              $${(matchingItem.priceCents/100).toFixed(2)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary">
                Update
              </span>
              <input type="text" inputmode="numeric"  class="quantity-input">
              <span class="save-quantity-link link-primary">
              Save
              </span>
              <span class="delete-quantity-link link-primary" data-id ="${matchingItem.id}">
              Delete
              </span>
            </div>
          </div>
          <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              ${updateDeliveryDate(matchingItem,cartItem)}
          </div>
        </div>
        </div>
      `
      document.querySelector('.order-summary').innerHTML = productList;
      
  //RENDER HEADER ITEM COUNT
  updateCartIcon()
  // DELETE COMPONENT 
  document.querySelectorAll('.delete-quantity-link').forEach((button)=>{
      button.onclick = ()=>{
        const container = button.closest('.cart-item-container');
        const productId = button.dataset.id
        removeFromCart(productId)
        container.remove()
        updateCartIcon();
        location.reload()
      }
    })
  // FUNCTIONS FOR DISPLAY OPTION
  function toggleShow(element){
    element.classList.toggle('show-element');
  }
  function toggleHide(element){
    element.classList.toggle('hide-element');
  }
  // DISPLAY UPDATE OPTIONS
  const updateLink = document.querySelectorAll('.update-quantity-link');
  updateLink.forEach((link)=>{
    link.onclick = (e)=>{
      const container = e.target.closest('.cart-item-container');
      const inputLink = container.querySelector('.quantity-input');
      const saveLink = container.querySelector('.save-quantity-link ');
      const quantityCounter = container.querySelector('.quantity-label');
      //UPDATE ACTIVE
      toggleShow(inputLink);
      toggleShow(saveLink);
      toggleHide(link);
      toggleHide(quantityCounter)
      //SAVE ACTIVE
      container.querySelector('.save-quantity-link ').onclick = ()=>{
        const newQuantity = parseInt(inputLink.value)
        if(newQuantity){
          quantityCounter.innerText = newQuantity;
          updateCartQuantity(container.dataset.id,newQuantity)
          updateCartIcon();
        }
        inputLink.value='';
        toggleShow(inputLink);
        toggleShow(saveLink);
        toggleHide(link);
        toggleHide(quantityCounter)
        location.reload()
      }
    }
  })
  //DATE MANUPULATION

  document.querySelectorAll('.delivery-option-input').forEach((option)=>{

    option.onclick = ()=>{
      const{productId,deliveryOptionId} = option.dataset
      updateDeliveryOption(productId,deliveryOptionId)
      location.reload();
    }
  })
//FUNCTION FOR RENDERING DELIVERY OPTIONS
  function updateDeliveryDate(matchingItem,cartItem){
    let html = '';
    deliveryOptions.forEach((deliveryOption)=>{
      const todayDate = dayjs();
      const deliveryDate = todayDate.add(deliveryOption.deliveryDays,'days')
      const dateString = deliveryDate.format('dddd, MMMM D')
      const priceString = deliveryOption.priceCents ==0? 'FREE': `$${deliveryOption.priceCents/100}-`
      html +=
      `
      <div class="delivery-option">
        <input ${deliveryOption.id == cartItem.deliveryOptionId? 'checked' : ''} type="radio" class="delivery-option-input" name="delivery-option-${matchingItem.id}" data-product-id ="${matchingItem.id}" data-delivery-option-id="${deliveryOption.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
      `
  
    })
    return html;
  }
  })
  //end loading
  document.querySelector('.loader').style.display = 'none'
}

//FUNCTION FOR RENDERING PAYMENT SECTION
function renderPayment(){
//PRICE CALCULATION

  let productPriceCents = 0;
  let deliveryOption;
  let shippingPriceCents =0;
  cart.forEach((cartItem)=>{
    let matchingItem;
      products.forEach((product)=>{
          if(product.id == cartItem.productId) matchingItem = product;
      });
    productPriceCents+= matchingItem.priceCents * cartItem.quantity  
    deliveryOptions.forEach((Option)=>{
      if(   Option.id == cartItem.deliveryOptionId) deliveryOption = Option;
    })
    shippingPriceCents+=deliveryOption.priceCents
  })
  const totalBeforeTaxCents =productPriceCents + shippingPriceCents;
  const estimatedTax = 0.1 * totalBeforeTaxCents;
  const totalCents = totalBeforeTaxCents + estimatedTax;
  totalPrice = (totalCents/100).toFixed(2)
//RENDERING PAYMENT SECTION
  const paymentHtml = 
    `
      <div class="payment-summary-title">
        Order Summary
      </div>
    
      <div class="payment-summary-row">
        <div>Items (${totalCartItem()})):</div>
        <div class="payment-summary-money">$${(productPriceCents/100).toFixed(2)}</div>
      </div>
    
      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${(shippingPriceCents/100).toFixed(2)}</div>
      </div>
    
      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${(totalBeforeTaxCents/100).toFixed(2)}</div>
      </div>
    
      <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${(estimatedTax/100).toFixed(2)}</div>
      </div>
    
      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${totalPrice}</div>
      </div>
    
      <button class="place-order-button button-primary">
        Place your order
      </button>
    `
    
    document.querySelector('.payment-summary').innerHTML= paymentHtml;
//ADD ORDER TO BACKEND
      document.querySelector('.place-order-button').onclick =  ()=>{
        if(cart.length == 0){
          alert('cart cannot be empty')
        }
        else{
          import('./orders.js').then((orders)=>{
          const order = cart
          orders.addOrder(order);
          location.href = 'orders.html';
          localStorage.removeItem('cart');
          })
        }
      }
    
} 

//CODE WITH PROMISE
  new Promise((resolve)=>{
    loadProducts(()=>{
      resolve()
    })
  }).then(()=>{
    renderCheckout();
    renderPayment();
  })
//CODE WITHOUT PROMISE
    // loadProducts(()=>{
    //   renderCheckout();
    //   renderPayment();
    // });