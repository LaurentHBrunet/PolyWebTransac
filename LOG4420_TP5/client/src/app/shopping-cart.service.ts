import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Config } from './config';
import { Subject } from 'rxjs';


export class CartProduct {
  productId: number;
  quantity: number;
}


@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  cartCount: Number;

  cartCountChange: Subject<Number> = new Subject<Number>();

  constructor(private http: HttpClient) { 
  }

  updateCartCount(newCount: Number) {
    this.cartCount = newCount;
    this.cartCountChange.next(this.cartCount);
  }

  addProductToCart(id: Number, quantity: Number) {
    const url = `${Config.apiUrl}/shopping-cart/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, withCredentials: true };

    return this.http.post(url, JSON.stringify({
      productId: id,
      quantity: quantity
      }), options).toPromise()
  }


  modifyProductQuantity(id: Number, quantity) {
    const url = `${Config.apiUrl}/shopping-cart/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, withCredentials: true };

    return this.http.put(url, JSON.stringify({
      productId: id,
      quantity: quantity
      }), options).toPromise()
  }

  getCart() {
    const url = `${Config.apiUrl}/shopping-cart/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, withCredentials: true };

    return this.http.get(url, options).toPromise() 
  }

  deleteCartItem(id: Number) {
    const url = `${Config.apiUrl}/shopping-cart/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, withCredentials: true };

    return this.http.delete(url, options).toPromise()
  }

  deleteCart() {
    const url = `${Config.apiUrl}/shopping-cart/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, withCredentials: true };

    return this.http.delete(url, options).toPromise() 
  }

  countCart(cart) {
    var count = 0;
    for(var i = 0; i < cart.length; i++) {
      count += cart[i].quantity;
    }

    this.updateCartCount(count);
    return count;
  }
}
