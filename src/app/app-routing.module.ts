import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/user/home/home.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { 
  DetailProductComponent 
} from './components/user/detail-product/detail-product.component';
import { OrderDetailComponent } from './components/user/order-detail/order-detail.component';
import { UserProfileComponent } from './components/user/user-profile/user.profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuardFn } from './guards/auth.guard';
import { AdminGuardFn } from './guards/admin.guard';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { CartComponent } from './components/user/cart/cart.component';
import { OrderComponent } from './components/user/order/order.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'authenticate', component: AuthenticateComponent }, 
  { path: 'register', component: RegisterComponent },
  { path: 'products/:id', component: DetailProductComponent },  
  { path: 'carts', component: CartComponent,canActivate:[AuthGuardFn] },
  { path: 'user-profile', component: UserProfileComponent, canActivate:[AuthGuardFn] },
  { path: 'orders/:id', component: OrderDetailComponent },
  {path: 'orders', component: OrderComponent,canActivate:[AuthGuardFn]},
  //Admin   
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate:[AdminGuardFn] 
  },      
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
