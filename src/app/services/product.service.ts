import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiBaseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }

  getProducts(
    keyword: string,
    categoryId: number,
    page: number,
    limit: number
  ): Observable<Product[]> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      keyword: keyword.toString(),
      category_id: categoryId.toString()
    };
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products`, { params });
  }

  getDetailProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiBaseUrl}/products/${productId}`);
  }

  getProductsByIds(productIds: number[]): Observable<Product[]> 
  {
    debugger
    const params = new HttpParams().set('ids',productIds.join(','));
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products/by-ids`,{params});
  }

}