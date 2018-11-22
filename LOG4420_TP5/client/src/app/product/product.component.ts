import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../products.service'
import { ProductsService } from '../products.service'
import { ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';


/**
 * Defines the component responsible to manage the product page.
 */
@Component({
  selector: 'product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  @ViewChild('confirmationDiv') confirmationDiv: ElementRef;
  @ViewChild('productCount') productCount: ElementRef;

  currentProduct: Product;
  showConfirmation: Boolean = false;
  
  /**
   * Initializes a new instance of the ProductComponent class.
   *
   * @param route                   The active route.
   */
  constructor(private route: ActivatedRoute, private productsService: ProductsService, private http: HttpClient) { 
  }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    this.productsService.getProduct(Number(productId)).then((product) => {
      this.currentProduct = product;
    });
  }


  addToCart() {
    this.showConfirmation = true;
    setTimeout(() => {
      this.showConfirmation = false;
    }, 5000);
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, withCredentials: true };

    console.log(this.currentProduct.id + " " + this.productCount.nativeElement.value);

    this.http.post('http://localhost:3000/api/shopping-cart', JSON.stringify({
      productId: this.currentProduct.id,
      quantity: Number(this.productCount.nativeElement.value)
    }), options).subscribe();
  }
}

