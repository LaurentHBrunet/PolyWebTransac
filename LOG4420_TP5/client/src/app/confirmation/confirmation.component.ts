import { OrdersService, Order } from 'app/orders.service';
import { ShoppingCartService } from 'app/shopping-cart.service';
import { Component, OnInit } from '@angular/core';

/**
* Defines the component responsible to manage the confirmation page.
*/
@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent {
  confirmationNumber;
  orderName;

  constructor(private ordersService: OrdersService, private shoppingCartService: ShoppingCartService) { }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    this.confirmationNumber = this.ordersService.confirmationNumber;
    this.orderName = this.ordersService.orderName;
    this.shoppingCartService.deleteCart().then(() => {
      this.shoppingCartService.updateCartCount(0);
    });
  }
}
