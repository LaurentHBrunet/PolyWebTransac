import { Component, OnInit } from '@angular/core';
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
export class ShoppingCartComponent implements OnInit {
  cart: CartProduct[] = [];
  products: Product[] = [];
  total: number = 0.0;

  constructor(private productsService: ProductsService, private shoppingCartService: ShoppingCartService) {

  }

  ngOnInit() {
    this.shoppingCartService.getCart().then((cart: CartProduct[]) => {
      var tempProducts: Product[] = [];
      this.productsService.getProducts().then((products) => {
        cart.forEach((cartProduct, index, arr) => {
          var product = products.find((value, index, arr) => {
            return value.id == cartProduct.productId;
          });
          tempProducts.push(product);
        });

        this.products = tempProducts.sort(function (a,b) {
          var aName = a.name.toLowerCase() as String;
          var bName = b.name.toLowerCase() as String;
          if (aName < bName) {
            return -1;
          } else if (aName > bName) {
            return 1;
          } else {
            return 0;
          }

        });
        this.cart = cart;
      });

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
