import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from './product.service';
import { Observable, of } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartDTO } from '../dtos/cart/cart.dto';
import { CartItem } from '../models/cart';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cart: Map<number, number> = new Map(); 
  private apiCart= `${environment.apiBaseUrl}/carts`
  private cartDTO?: CartDTO;
  private apiConfig = {
    headers: this.createHeaders()
  }

  constructor(private http: HttpClient, private productService: ProductService, private tokenService:TokenService) {   
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = new Map(JSON.parse(storedCart));      
    }
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-type': 'application/json',
      'Accept-Language': 'vi'
    });
  }
  addToCart(productId: number, quantity: number = 1): Observable<any> {
    const userId = this.tokenService.getUserId();
    this.cartDTO = new CartDTO(userId,productId,quantity);
    return this.http.post(this.apiCart,this.cartDTO, this.apiConfig);
  }
  deleteProduct(productId: number): Observable<any>
  {
    const userId = this.tokenService.getUserId();
    return this.http.delete(`${this.apiCart}/${userId}/${productId}`,this.apiConfig)
  }
  
  getCart(): Observable<any>{
    const user_id = this.tokenService.getUserId();
    return this.http.get<CartItem[]>(this.apiCart+`/${user_id}`)
  }  

}
