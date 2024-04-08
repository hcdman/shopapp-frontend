import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Product } from 'src/app/models/product';
import { ProductImage } from 'src/app/models/product.image';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  count: number = 1;

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    const idParam = 2
    this.productId = idParam;
    // if (idParam !== null) {
    //   this.productId = +idParam;
    // }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {

          debugger
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach(
              (product_image: ProductImage) => {
                product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
              });
          }
          debugger
          this.product = response
          this.showImage(0);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching detail:', error);
        }
      });
    } else {
      console.error('Invalid productId:', idParam);
    }
  }
  showImage(index: number): void {
    debugger
    if (this.product && this.product.product_images &&
      this.product.product_images.length > 0) {

      if (index < 0) {
        index = this.product.product_images.length - 1;
      } else if (index >= this.product.product_images.length) {
        index = 0;
      }

      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    debugger

    this.currentImageIndex = index; // Cáº­p nháº­t currentImageIndex
  }
  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }
  increase(): void {
    this.count++;
  }
  decrease(): void {
    if (this.count >= 2) { this.count--; }
  }

}
