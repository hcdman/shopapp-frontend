import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { TokenService } from '../../services/token.service';
import { OrderDTO } from '../../dtos/order/order.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/models/order';
import { environment } from 'src/app/environments/environment';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/models/cart';
import { UserService } from 'src/app/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserResponse } from 'src/app/responses/user/user.response';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit{
  orderForm: FormGroup; 
  cartItems: { product: Product, quantity: number }[] = [];
  couponCode: string = ''; 
  totalAmount: number = 0; 
  userResponse?:UserResponse | null;
  orderData: OrderDTO = {
    user_id: 0, 
    fullname: '', 
    email: '',     
    phone_number: '',
    address: '', 
    status: 'pending',
    note: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express', 
    coupon_code: '',
    cart_items: [],
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private userService : UserService,
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc      
      email: ['', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      note: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }
  
  ngOnInit(): void {  
    debugger
    this.orderData.user_id = this.tokenService.getUserId();    
    debugger
    this.cartService.getCart().subscribe(
      {
        next: (data: CartItem[])=>
        {
          //assign data to cartItems
          this.cartItems = data.map(item => ({
            product: {
              ...item.product,
              thumbnail: `${environment.apiBaseUrl}/products/images/${item.product.thumbnail}`
            },
            quantity: item.quantity
          }));
        
        },
        complete: ()=>
        {
          this.calculateTotal()
        }
      }
    );      
  }
  placeOrder() {
    debugger
    if (this.orderForm.errors == null) {
      // Gán giá trị từ form vào đối tượng orderData
    
      this.orderData.fullname = this.orderForm.get('fullname')!.value;
      this.orderData.email = this.orderForm.get('email')!.value;
      this.orderData.phone_number = this.orderForm.get('phone_number')!.value;
      this.orderData.address = this.orderForm.get('address')!.value;
      this.orderData.note = this.orderForm.get('note')!.value;
      this.orderData.shipping_method = this.orderForm.get('shipping_method')!.value;
      this.orderData.payment_method = this.orderForm.get('payment_method')!.value;
  
      // Sử dụng toán tử spread (...) để sao chép giá trị từ form vào orderData
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };

      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
      this.orderData.total_money =  this.totalAmount;
      // Dữ liệu hợp lệ, bạn có thể gửi đơn hàng đi
      if(this.orderData.payment_method=="cod")
      {
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response:Order) => {
          debugger;          
          alert('Đặt hàng thành công');
          this.router.navigate(['/']);
        },
        complete: () => {
          debugger;
          this.calculateTotal();
        },
        error: (error: any) => {
          debugger;
          alert(`Lỗi khi đặt hàng: ${error}`);
        },
      });
    }  
    if(this.orderData.payment_method=="vnpay")
    {
      //
      debugger
      this.userResponse =  this.userService.getUserResponse();
      const userResponseJson = JSON.stringify(this.userResponse);
      const expiredDate = new Date();
      expiredDate.setMinutes(expiredDate.getMinutes()+10);
      this.cookieService.set("userTemp", userResponseJson, expiredDate, "/", "localhost", true, "None");
      this.orderService.vnpayOrder(this.orderData).subscribe(
        {
          next: (response: any)=>
          {
            console.log(response.message);
            window.location.href = response.message
          },
          complete: ()=>
          {

          }
        }
      )
    }  
  }     
  }
    
    
  
  // Hàm tính tổng tiền
  calculateTotal(): void {
      this.totalAmount = this.cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
      );
  }
  deleteProduct(productId: number): void{
    this.cartService.deleteProduct(productId).subscribe(
      {
       next: (response: any)=>
        {
          console.log(response);
          
        },
        complete: ()=>
        {
          this.ngOnInit();
        },
        error: (error: any)=>
        {
          console.log(error.error.message);
          
        }
      }
    )
  }
  // Hàm xử lý việc áp dụng mã giảm giá
  applyCoupon(): void {
      // Viết mã xử lý áp dụng mã giảm giá ở đây
      // Cập nhật giá trị totalAmount dựa trên mã giảm giá nếu áp dụng
  }
}
