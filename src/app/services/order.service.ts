import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { 
  HttpClient, 
  HttpParams, 
  HttpHeaders 
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { OrderDTO } from '../dtos/order/order.dto';
import { OrderResponse } from '../responses/order/order.response';
import { environment } from '../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;
  private apiVnpay = `${environment.apiBaseUrl}/vnpay`
  private apiGetAllOrders = `${environment.apiBaseUrl}/orders/get-orders-by-keyword`;
  private apiGetOrderUser = `${environment.apiBaseUrl}/orders/user`

  constructor(private http: HttpClient,  
     private userService: UserService

  ) {}

  placeOrder(orderData: OrderDTO): Observable<any> {    
    // Gửi yêu cầu đặt hàng
    return this.http.post(this.apiUrl, orderData);
  }
  vnpayOrder(orderData: OrderDTO):Observable<any>{
    return this.http.post(this.apiVnpay+"/submitOrder",orderData);
  }

  getOrderById(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.get(url);
  }
  getAllOrders(keyword:string,
    page: number, limit: number
  ): Observable<OrderResponse[]> {
      const params = new HttpParams()
      .set('keyword', keyword)      
      .set('page', page.toString())
      .set('limit', limit.toString());            
      return this.http.get<any>(this.apiGetAllOrders, { params });
  }
  getOrdersUser(keyword:string,
    page: number, limit: number
  ): Observable<OrderResponse[]> {
    let userResponse = this.userService.getUserResponse();
      const params = new HttpParams()
      .set('keyword', keyword)      
      .set('page', page.toString())
      .set('limit', limit.toString());            
      return this.http.get<any>(this.apiGetOrderUser+`/${userResponse.id}`, { params });
  }
  updateOrder(orderId: number, orderData: OrderDTO): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.put(url, orderData);
  }
  deleteOrder(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.delete(url, { responseType: 'text' });
  }
}
