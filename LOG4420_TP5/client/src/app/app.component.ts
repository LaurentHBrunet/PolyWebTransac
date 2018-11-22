import { Component, Input } from '@angular/core';
import { ShoppingCartService } from 'app/shopping-cart.service';
import { Subscription } from 'rxjs';
/**
 * Defines the main component of the application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  cartCount: Number;
  _subscription: Subscription;

  readonly authors = [
    'Laurent Henault-Brunet',
    'Gregory Fournier'
  ];

  constructor(private shoppingCartService: ShoppingCartService) {
    this.cartCount = shoppingCartService.cartCount;
    this._subscription = shoppingCartService.cartCountChange.subscribe((newCount) => {
      this.cartCount = newCount;
    })
  }

  ngOnInit() {
    this.shoppingCartService.getCart().then((cart) => {
      this.cartCount = this.shoppingCartService.countCart(cart);
    })
  }
  // TODO: À compléter
}
