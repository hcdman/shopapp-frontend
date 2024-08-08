import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderResponse } from 'src/app/responses/order/order.response';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  orders: OrderResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages:number = 0;
  keyword:string = "";
  visiblePages: number[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router,
  ) {

  }
  ngOnInit(): void {
    debugger
    this.currentPage = 1; 
    this.getAllOrders(this.keyword, this.currentPage-1, this.itemsPerPage);
  }
  searchOrders() {
    this.currentPage = 1;
    this.itemsPerPage = 12;
    debugger
    this.getAllOrders(this.keyword.trim(), this.currentPage-1, this.itemsPerPage);
  }
  getAllOrders(keyword: string, page: number, limit: number) {
    debugger
    this.orderService.getOrdersUser(keyword, page, limit).subscribe({
      next: (response: any) => {
        debugger       
        this.orders = response.orders;
        console.log(this.orders);
        
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage-1, this.totalPages);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
      }
    });    
  }
  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    localStorage.setItem('currentOrderAdminPage', String(this.currentPage-1));         
    this.getAllOrders(this.keyword, this.currentPage-1, this.itemsPerPage);
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

  deleteOrder(id:number) {
    const confirmation = window
      .confirm('Are you sure you want to delete this order?');
    if (confirmation) {
      debugger
      this.orderService.deleteOrder(id).subscribe({
        next: (response: any) => {
          debugger 
          location.reload();          
        },
        complete: () => {
          debugger;          
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
        }
      });    
    }
  }
  viewDetails(order:OrderResponse) {
    debugger
    this.router.navigate(['/admin/orders', order.id]);
  }
}
