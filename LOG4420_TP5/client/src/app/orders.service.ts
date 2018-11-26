import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Config } from './config';

/**
 * Defines a product.
 */
export class Order {
  id: number;
  firstName: string;
  lastName: String;
  email: String;
  phone: String;
  products: any[];
}

/**
 * Defines the service responsible to handle orders
 */
@Injectable()
export class OrdersService {
  confirmationNumber;
  orderName;

  /**
   * Handles the current error.
   *
   * @param error                   The error to handle.
   * @return {Promise<object>}      A promise object.
   */
  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.feedbackMessage || error);
  }

  /**
   * Initializes a new instance of the OrdersService class.
   *
   * @param http                    The HTTP service to use.
   */
  constructor(private http: HttpClient) { }

  getOrders(): Promise<Order[]> {
    const url = `${Config.apiUrl}/orders/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, withCredentials: true };

    return this.http.get(url)
      .toPromise()
      .then(orders => orders as Order[])
      .catch(() => null);
  }

  addOrder(order: Order) {
    const url = `${Config.apiUrl}/orders/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, withCredentials: true };

    this.confirmationNumber = order.id;
    this.orderName = order.firstName + " " + order.lastName;


    return this.http.post(url, JSON.stringify({
      id: order.id,
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      phone: order.phone,
      products: order.products as []
    }), options)
      .toPromise()
      .catch((err) => console.log(err));
  }
}
