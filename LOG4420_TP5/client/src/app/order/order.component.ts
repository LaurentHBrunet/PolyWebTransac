import { Component, OnInit } from '@angular/core';
import { OrdersService, Order } from 'app/orders.service';
import { ShoppingCartService } from 'app/shopping-cart.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

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

  constructor(private ordersService: OrdersService, private shoppingCartService: ShoppingCartService, private router: Router) { }

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
  submit(orderForm: NgForm) {
    if (!this.orderForm.valid()) {
      return;
    }
    // Get next order id
    this.ordersService.getOrders().then((orders) => {
      var newId;
      console.log(orders);
      if (orders != null && orders.length != 0) {
        newId = orders[orders.length - 1].id + 1
      } else {
        newId = 1;
      }
      this.shoppingCartService.getCart().then((cart) => {
        var order = new Order();
        order.id = newId;
        order.firstName = orderForm.controls["first-name"].value;
        order.lastName = orderForm.controls["last-name"].value;
        order.email = orderForm.controls["email"].value;
        order.phone = orderForm.controls["phone"].value;
        order.products = this.convertCartItems(cart) as [];

        this.ordersService.addOrder(order).then(() => {
          console.log(order);
          this.router.navigateByUrl('/confirmation');
        })

      });
    })

  }

  getElementValue(name: string) {
    return (document.getElementsByName(name)[0] as HTMLInputElement).value;
  }

  convertCartItems(cart) {
    var products = [];
    cart.forEach(element => {
      products.push({ "id": element.productId, "quantity": element.quantity });
    });
    return products;
  }
} 
