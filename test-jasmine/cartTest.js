// import {} from '../data/cart'
import {} from '../scripts/amazon.js'

describe('Test suite: Add to cart',()=>
{
    it('adds an existing product to the cart',()=>{

    })    
    it('adds new product',()=>{
        spyOn(localStorage,'getItem').and.callFake(()=>{
            return JSON.stringify([]);
        })
        addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(cart.length.equalTo(1))
    })
})