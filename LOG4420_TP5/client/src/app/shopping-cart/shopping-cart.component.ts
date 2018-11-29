import { Component } from '@angular/core';
import { ProductsService } from '../products.service'
import { Product } from '../products.service'
import { ShoppingCartService, CartProduct } from 'app/shopping-cart.service';

/**
 * Defines the component responsible to manage the shopping cart page.
 */
@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent {
  cart: CartProduct[] = [];
  products: Product[] = [];
  total: number = 0.0;

  constructor(private productsService: ProductsService, private shoppingCartService: ShoppingCartService) {
    this.shoppingCartService.getCart().then((cart: CartProduct[]) => {
      var tempProducts = [];
      cart.forEach((cartProduct, index, arr) => {
        this.productsService.getProduct(cartProduct.productId).then((product) => {
          tempProducts.push(product);
        })
      });
      this.products = tempProducts.sort(function(a, b) {
        return a.name.toUpperCase() - b.name.toUpperCase()
      });
      this.cart = cart;
    });
  }

  emptyCart() {
    if (confirm("Voulez vous vraiment vider le panier?")) {
      this.shoppingCartService.deleteCart().then(_ => {
      this.products = [];
      this.cart = [];
      this.updateCartCount();
    });
    }
    
  }

  removeQuantity(item: Product) {
    var index = this.getCartItemIndex(item);
    this.cart[index].quantity--;
    this.shoppingCartService.modifyProductQuantity(item.id, this.cart[index].quantity).then(_ => {
      this.updateCartCount();
    });
  }

  addQuantity(item: Product) {
    var index = this.getCartItemIndex(item);
    this.cart[index].quantity++
    this.shoppingCartService.modifyProductQuantity(item.id, this.cart[index].quantity).then(_ => {
      this.updateCartCount();
    });
  }

  removeItem(item: Product) {
    if (confirm("Voulez vous vraiment supprimer " + item.name + "?")) {
      this.products = this.products.filter(product => product.id !== item.id);
    this.cart = this.cart.filter(product => product.productId !== item.id);
    this.shoppingCartService.deleteCartItem(item.id).then(_ => {
      this.updateCartCount();
    });
    }
  }

  getCartItem(product: Product) {
    return this.cart.find(x => x.productId == product.id);
  }

  getCartItemIndex(product: Product) {
    return this.cart.findIndex(x => x.productId == product.id);
  }

  updateCartCount() {
    this.shoppingCartService.getCart().then(cart => {
      this.shoppingCartService.countCart(cart);
    });
  }

  updateTotal() {
    this.total = 0;
    this.products.forEach(product => {
      this.total += this.getCartItem(product).quantity * product.price;
    });
  }
}
