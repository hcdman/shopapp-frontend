import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //some field 
  products: Product[] = [];
  currentPage: number = 0;
  itemsPerpage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  categories: Category[]=[];
  selectedCategoryId: number=0;
  keyword: string ='';
  constructor(private productService: ProductService,private categoryService: CategoryService) { }

  ngOnInit() {
    this.getProducts(this.currentPage, this.itemsPerpage);
    this.getCategories();
    //get category to dispay
  }

  //get product
  getProducts(page: number, limit: number) {
    this.productService.getProducts(this.keyword,this.selectedCategoryId,page, limit).subscribe(
      {
        next: (response: any) => {
          debugger
          response.products.forEach((product: Product) => {
            product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          });
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          console.error(error);

        }
      }
    )
  }
  getCategories()
  {
    this.categoryService.getCategories().subscribe(
      {
        next: (categories: Category[])=>
          {
            this.categories = categories;
          },
          error: (error:any)=>
            {
              console.log(`Error getting roles: `,error);
              
            }
      }
    )
  }
  searchProduct()
  {
    this.currentPage=0;
    this.itemsPerpage=12;
    this.getProducts(this.currentPage, this.itemsPerpage);
  }
  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    localStorage.setItem('currentProductPage', String(this.currentPage)); 
    this.getProducts(this.currentPage, this.itemsPerpage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }


}
