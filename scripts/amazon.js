//IMPORTS
import {cart,addToCart} from '../data/cart.js';
import {products,loadProducts} from '../data/products.js';
// EXPORT
export function updateCartIcon(){
  let totalQuantity =0;
  cart.forEach((item)=>{
     totalQuantity += parseInt(item.quantity )
  })
  document.querySelector('.cart-quantity').innerText = totalQuantity
};
function renderFilteredProducts(filteredProducts){
  console.log('FILTERED')
  let productItems = '';
  filteredProducts.forEach((product)=>{
      productItems += 
      `<div class="product-container">
    <div class="product-image-container">
      <img class="product-image"
        src="${product.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">
      ${product.name}
    </div>

    <div class="product-rating-container">
      <img class="product-rating-stars"
        src="${product.getStarsUrl()}">
      <div class="product-rating-count link-primary">
        ${product.rating.count}
      </div>
    </div>

    <div class="product-price">
      $${product.getPrice()}
    </div>

    <div class="product-quantity-container">
      <select class="product-quantity-select">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>

    ${product.extraInfoHtml()}

    <div class="product-spacer"></div>

    <div class="added-to-cart">
      <img src="images/icons/checkmark.png">
      Added
    </div>

    <button class="add-to-cart-button button-primary" data-product-id = "${product.id}">
      Add to Cart
    </button>
      </div>`;
  })
  document.querySelector('.products-grid').innerHTML = productItems;
  updateCartIcon()
  //FUNCTION
  function showAdded(event){
        const container=event.target.closest('.product-container')
        const addCart = container.querySelector('.added-to-cart').style
        addCart.opacity= 1
        setTimeout(()=>{
        addCart.opacity = 0
        },2000)
  }
  
  //Onclick of add to cart button 
  document.querySelectorAll('.add-to-cart-button').forEach((button)=>{
      button.onclick = (e)=>{
          addToCart(button,e);
          updateCartIcon(); 
          showAdded(e);
      }
  })
}

// START
  loadProducts(renderProductsGrid)
  
  function renderProductsGrid(){
            //LOAD PRODUCTS
            let productItems = '';
            products.forEach((product)=>{
                productItems += 
                `<div class="product-container">
              <div class="product-image-container">
                <img class="product-image"
                  src="${product.image}">
              </div>
    
              <div class="product-name limit-text-to-2-lines">
                ${product.name}
              </div>
    
              <div class="product-rating-container">
                <img class="product-rating-stars"
                  src="${product.getStarsUrl()}">
                <div class="product-rating-count link-primary">
                  ${product.rating.count}
                </div>
              </div>
    
              <div class="product-price">
                $${product.getPrice()}
              </div>
    
              <div class="product-quantity-container">
                <select class="product-quantity-select">
                  <option selected value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>
    
              ${product.extraInfoHtml()}
    
              <div class="product-spacer"></div>
    
              <div class="added-to-cart">
                <img src="images/icons/checkmark.png">
                Added
              </div>
    
              <button class="add-to-cart-button button-primary" data-product-id = "${product.id}">
                Add to Cart
              </button>
                </div>`;
            })
            document.querySelector('.products-grid').innerHTML = productItems;
            updateCartIcon()
            //FUNCTION
            function showAdded(event){
                  const container=event.target.closest('.product-container')
                  const addCart = container.querySelector('.added-to-cart').style
                  addCart.opacity= 1
                  setTimeout(()=>{
                  addCart.opacity = 0
                  },2000)
            }
            
            //Onclick of add to cart button 
            document.querySelectorAll('.add-to-cart-button').forEach((button)=>{
                button.onclick = (e)=>{
                    addToCart(button,e);
                    updateCartIcon(); 
                    showAdded(e);
                }
            })

            //Search Feature
            document.querySelector('.search-button').addEventListener('click',()=>{
              const searchValue = document.querySelector('.search-bar').value
              const filteredProducts = products.filter((productItem)=>{
              let isKeywordMatch = false;
              productItem.keywords.forEach((keyword)=>{
                if(keyword.toLowerCase().includes(searchValue.toLowerCase().trim())) isKeywordMatch=true;
              })
               return isKeywordMatch ||productItem.name.toLowerCase().includes(searchValue.toLowerCase().trim())  
              }) 
              renderFilteredProducts(filteredProducts);
           
            })
            //end loading
            document.querySelector('.loader').style.display = 'none'

  }

