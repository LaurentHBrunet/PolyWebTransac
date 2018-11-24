import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../products.service'
import { ProductsService } from '../products.service'
import { ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ShoppingCartService } from 'app/shopping-cart.service';
import { CartProduct } from 'app/shopping-cart.service';


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
  constructor(private route: ActivatedRoute,
              private productsService: ProductsService, 
              private http: HttpClient,
              private shoppingCartService: ShoppingCartService) { 
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
    this.shoppingCartService.getCart().then((cart :[]) => {
      for (var i = 0; i < cart.length; i++) {
        var cartProduct : CartProduct = cart[i];
        if (cartProduct.productId == this.currentProduct.id) {
          this.shoppingCartService.modifyProductQuantity(this.currentProduct.id, cartProduct.quantity + Number(this.productCount.nativeElement.value)).then(() => {
            this.confirmation();
            this.shoppingCartService.getCart().then((cart) => {
              console.log(this.shoppingCartService.countCart(cart));
              //UPDATE COUNT
            });
          }).catch((err) => {
            console.log(err);
          });

          return;
        }
      }

      this.shoppingCartService.addProductToCart(this.currentProduct.id, Number(this.productCount.nativeElement.value)).then((product) => {
        this.confirmation();
        this.shoppingCartService.getCart().then((cart) => {
            console.log(this.shoppingCartService.countCart(cart));
            //update count
        });
      }).catch((err) => {
        console.log(err); 
      });
    });
  }

  confirmation() {
    this.showConfirmation = true;
    setTimeout(() => {
      this.showConfirmation = false;
    }, 5000);
  }
}

