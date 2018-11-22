import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Config } from './config';


export class CartProduct {
  productId: number;
  quantity: number;
}


@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private http: HttpClient) { 
  }

/*
  addProductToCart(id: Number, quantity: Number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, withCredentials: true };

    this.http.post('http://localhost:3000/api/shopping-cart', JSON.stringify({
      productId: id, 
      quantity: quantity 
    }), options).subscribe();
  
  }
*/
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

  countCart(cart) {
    var count = 0;
    for(var i = 0; i < cart.length; i++) {
      count += cart[i].quantity;
    }

    return count;
  }
}
