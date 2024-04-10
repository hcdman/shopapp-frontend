import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { environment } from 'src/app/environments/environment';
import { OrderDTO } from '../../dtos/order/order.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';

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
  orderData: OrderDTO = {
    user_id: 5, 
    fullname: '', 
    email: '', 
    phone_number: '', 
    address: '', 
    note: '', 
    total_money: 0, 
    payment_method: 'cod', 
    shipping_method: 'express',
    coupon_code: '', 
    cart_items: []
  };

  constructor(
    private router: Router,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private fb: FormBuilder // build form and validate value in per field in form
  ) {
    
    this.orderForm = this.fb.group({
      fullname: ['test name', Validators.required], 
      email: ['hoang234@gmail.com', [Validators.email]], 
      phone_number: ['11445547', [Validators.required, Validators.minLength(6)]], 
      address: ['test address', [Validators.required, Validators.minLength(5)]], 
      note: ['test note'],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }
  
  ngOnInit(): void {        
    
    debugger
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());
    debugger
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {            
        debugger
     
        this.cartItems = productIds.map((productId) => {
          debugger
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }          
          return {
            product: product!,
            quantity: cart.get(productId)!
          };
        });
      },
      complete: () => {
        debugger;
        this.calculateTotal()
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });        
  }
  placeOrder() {
    debugger
    if (this.orderForm.valid) {

      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };
      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
      this.orderData.total_money = this.totalAmount;
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response) => {
          alert('Đặt hàng thành công');
          this.cartService.clearCart();
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
    } else {
      alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }        
  }
    
    
  

  calculateTotal(): void {
      this.totalAmount = this.cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
      );

  }

  applyCoupon(): void {

  }
}
