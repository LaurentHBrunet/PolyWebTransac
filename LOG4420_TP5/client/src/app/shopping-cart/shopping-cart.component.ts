import { Component } from '@angular/core';
import { ProductsService } from '../products.service'
import { Product } from '../products.service'

/**
 * Defines the component responsible to manage the shopping cart page.
 */
@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent {
  // TODO: À compléter
  cart: any[] = [{"productId": 1, "quantity": 2},{"productId": 2, "quantity": 1}];
  products: Product[] = [];
  total: number = 0.0;

  constructor(private productsService: ProductsService) {
    this.productsService.getProduct(1).then((product1) => {
      this.products[0] = product1;
      this.productsService.getProduct(2).then((product2) => {
        this.products[1] = product2;
      }); 
    }); 
  }

  emptyCart() {
    this.cart = [];
    this.products = [];
  }

  removeQuantity(item) {
    var index = this.getCartItemIndex(item);
    this.cart[index].quantity--;
  }

  addQuantity(item) {
    var index = this.getCartItemIndex(item);
    this.cart[index].quantity++;
  }

  removeItem(item) {  
    this.products = this.products.filter(product => product.id !== item.id);
    this.cart = this.cart.filter(item => item.productId !== item.id);
  }

  getCartItem(product) {
    return this.cart.find(x => x.productId == product.id);
  }

  getCartItemIndex(product) {
    return this.cart.findIndex(x => x.productId == product.id);
  }

  updateTotal() {
    this.total = 0;
    this.products.forEach(product => {
      this.total += this.getCartItem(product).quantity * product.price;
    });
  }
}
