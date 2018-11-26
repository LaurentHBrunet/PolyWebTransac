import { Component, OnInit } from '@angular/core';
import { OrdersService, Order } from 'app/orders.service';
import { ShoppingCartService } from 'app/shopping-cart.service';
import { Router } from '@angular/router';

declare const $: any;

/**
 * Defines the component responsible to manage the order page.
 */
@Component({
  selector: 'order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  orderForm: any;

  constructor(private ordersService: OrdersService, private shoppingCartService: ShoppingCartService, private router: Router) {

  }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    // Initializes the validation of the form. This is the ONLY place where jQuery usage is allowed.
    this.orderForm = $('#order-form');
    $.validator.addMethod('ccexp', function (value) {
      if (!value) {
        return false;
      }
      const regEx = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[1-9][0-9])$/g;
      return regEx.test(value);
    }, 'La date d\'expiration de votre carte de crédit est invalide.');
    this.orderForm.validate({
      rules: {
        'phone': {
          required: true,
          phoneUS: true
        },
        'credit-card': {
          required: true,
          creditcard: true
        },
        'credit-card-expiry': {
          ccexp: true
        }
      }
    });
  }

  /**
   * Submits the order form.
   */
  submit() {
    if (!this.orderForm.valid()) {
      return;
    }
    // Get nex order id
    this.ordersService.getOrders().then((orders) => {
      console.log("The orders are");
      console.log(orders);
      var newId = orders[orders.length - 1].id + 1;
      this.shoppingCartService.getCart().then((cart) => {
        var order = new Order();
        order.id = newId;
        order.firstName = this.getElementValue("first-name");
        order.lastName = this.getElementValue("last-name");
        order.email = this.getElementValue("email");
        order.phone = this.getElementValue("phone");
        order.products = [] as [];

        console.log("Order to send");
        console.log(order);


        this.ordersService.addOrder(order).then(() => {
          console.log(order);
          this.router.navigateByUrl('/confirmation');
        })

      });
    })

  }

  getElementValue(name: string) {
    return document.getElementsByName(name)[0].value;
  }
} 
