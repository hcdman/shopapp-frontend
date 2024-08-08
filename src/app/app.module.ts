import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/user/home/home.component';
import { HeaderComponent } from './components/user/header/header.component';
import { FooterComponent } from './components/user/footer/footer.component';
import { DetailProductComponent } from './components/user/detail-product/detail-product.component';
import { OrderDetailComponent } from './components/user/order-detail/order-detail.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { UserProfileComponent } from './components/user/user-profile/user.profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AdminModule } from './components/admin/admin.module';
import { 
  HttpClientModule, 
  HTTP_INTERCEPTORS 
} from '@angular/common/http';
import { TokenInterceptor } from './interceptors/interceptor';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { CartComponent } from './components/user/cart/cart.component';
import { OrderComponent } from './components/user/order/order.component';


@NgModule({
  declarations: [    
    HomeComponent, 
    HeaderComponent,
    FooterComponent, 
    DetailProductComponent, 
    CartComponent, 
    OrderDetailComponent, 
    LoginComponent, 
    RegisterComponent, 
    UserProfileComponent,
    AppComponent,
    AuthenticateComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,    
    AppRoutingModule,    
    NgbModule,        
    AdminModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
