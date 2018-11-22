import { Component } from '@angular/core';
import { ProductsService } from '../products.service'
import { Product } from '../products.service'
/**
 * Defines the component responsible to manage the display of the products page.
 */
@Component({
  selector: 'products',
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  products: Product[];
  classifierState: ClassifierState;

  constructor(private productsService: ProductsService) {
    this.classifierState = {
      category: Category.all,
      criteria: Criteria.priceAsc
    }
    this.getProducts();
  }

  logProducts() {
    console.log(this.products);
  }

  getProducts(): void {
    this.productsService.getProducts(this.classifierState.criteria, this.classifierState.category).then((products) => {
      this.products = products;
    });
  }

  getCameras() {
    this.classifierState.category = Category.cameras;
    this.getProducts();
  }

  getConsoles() {
    this.classifierState.category = Category.consoles;
    this.getProducts();
  }

  getScreens() {
    this.classifierState.category = Category.screens;
    this.getProducts();
  }

  getComputers() {
    this.classifierState.category = Category.computers;
    this.getProducts();
  }

  getAll() {
    this.classifierState.category = Category.all;
    this.getProducts();
  }

  getPriceAsc() {
    this.classifierState.criteria = Criteria.priceAsc;
    this.getProducts();
  }

  getPriceDsc() {
    this.classifierState.criteria = Criteria.priceDsc;
    this.getProducts();
  }

  getAlphaAsc() {
    this.classifierState.criteria = Criteria.alphaAsc;
    this.getProducts();
  }
  
  getAlphaDsc() {
    this.classifierState.criteria = Criteria.alphaDsc;
    this.getProducts();
  }
}

interface ClassifierState {
  category: Category;
  criteria: Criteria;
}

enum Category {
  cameras = "cameras",
  computers = "computers",
  consoles = "consoles",
  screens = "screens",
  all = "all"
}

enum Criteria {
  alphaAsc = "alpha-asc",
  alphaDsc = "alpha-dsc",
  priceAsc = "price-asc",
  priceDsc = "price-dsc"
}
