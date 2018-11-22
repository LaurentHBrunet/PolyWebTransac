import { Component } from '@angular/core';
import { ProductsService } from '../products.service'
import { Product } from '../products.service'
import { ViewChild, ElementRef, AfterViewInit} from '@angular/core';

/**
 * Defines the component responsible to manage the display of the products page.
 */
@Component({
  selector: 'products',
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  @ViewChild('camerasButton') camerasButton: ElementRef;
  @ViewChild('consolesButton') consolesButton: ElementRef;
  @ViewChild('screensButton') screensButton: ElementRef;
  @ViewChild('computersButton') computersButton: ElementRef;
  @ViewChild('allButton') allButton: ElementRef;

  @ViewChild('priceAscButton') priceAscButton: ElementRef;
  @ViewChild('priceDscButton') priceDscButton: ElementRef;
  @ViewChild('alphaAscButton') alphaAscButton: ElementRef;
  @ViewChild('alphaDscButton') alphaDscButton: ElementRef;

  categoryButtons: ElementRef[]; 
  criteriaButtons: ElementRef[];

  products: Product[];
  classifierState: ClassifierState;
  
  ngAfterViewInit() {
    this.categoryButtons = [this.camerasButton, this.consolesButton, this.screensButton, this.computersButton, this.allButton];
    this.criteriaButtons = [this.priceAscButton, this.priceDscButton, this.alphaAscButton, this.alphaDscButton];
  }

  constructor(private productsService: ProductsService) {
    this.classifierState = {
      category: Category.all,
      criteria: Criteria.priceAsc
    }
    this.getProducts();
  }

  getProducts(): void {
    this.productsService.getProducts(this.classifierState.criteria, this.classifierState.category).then((products) => {
      this.products = products;
    });
  }

  getCameras() {
    this.unselectCategories();
    this.camerasButton.nativeElement.classList.add("selected");
    this.classifierState.category = Category.cameras;
    this.getProducts();
  }

  getConsoles() {
    this.unselectCategories();
    this.consolesButton.nativeElement.classList.add("selected");
    this.classifierState.category = Category.consoles;
    this.getProducts();
  }

  getScreens() {
    this.unselectCategories();
    this.screensButton.nativeElement.classList.add("selected");
    this.classifierState.category = Category.screens;
    this.getProducts();
  }

  getComputers() {
    this.unselectCategories();
    this.computersButton.nativeElement.classList.add("selected");
    this.classifierState.category = Category.computers;
    this.getProducts();
  }

  getAll() {
    this.unselectCategories();
    this.allButton.nativeElement.classList.add("selected");
    this.classifierState.category = Category.all;
    this.getProducts();
  }

  getPriceAsc() {
    this.unselectCriterias();
    this.priceAscButton.nativeElement.classList.add("selected");
    this.classifierState.criteria = Criteria.priceAsc;
    this.getProducts();
  }

  getPriceDsc() {
    this.unselectCriterias();
    this.priceDscButton.nativeElement.classList.add("selected");
    this.classifierState.criteria = Criteria.priceDsc;
    this.getProducts();
  }

  getAlphaAsc() {
    this.unselectCriterias();
    this.alphaAscButton.nativeElement.classList.add("selected");
    this.classifierState.criteria = Criteria.alphaAsc;
    this.getProducts();
  }
  
  getAlphaDsc() {
    this.unselectCriterias();
    this.alphaDscButton.nativeElement.classList.add("selected");
    this.classifierState.criteria = Criteria.alphaDsc;
    this.getProducts();
  }

  unselectCategories() {
    for (var i = 0; i < this.categoryButtons.length; i++) {
      this.categoryButtons[i].nativeElement.classList.remove("selected");
    }
  }

  unselectCriterias() {
    for (var i = 0; i < this.criteriaButtons.length; i++) {
      this.criteriaButtons[i].nativeElement.classList.remove("selected");
    }
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
