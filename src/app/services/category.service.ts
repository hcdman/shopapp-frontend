import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { UpdateCategoryDTO } from '../dtos/category/update.category.dto';
import { InsertCategoryDTO } from '../dtos/category/insert.category.dto';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }
  getCategories():Observable<Category[]> {
    
      return this.http.get<Category[]>(`${environment.apiBaseUrl}/categories`);           
  }
  getDetailCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiBaseUrl}/categories/${id}`);
  }
  deleteCategory(id: number): Observable<string> {
    debugger
    return this.http.delete<string>(`${this.apiBaseUrl}/categories/${id}`);
  }
  updateCategory(id: number, updatedCategory: UpdateCategoryDTO): Observable<UpdateCategoryDTO> {
    return this.http.put<Category>(`${this.apiBaseUrl}/categories/${id}`, updatedCategory);
  }  
  insertCategory(insertCategoryDTO: InsertCategoryDTO): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/categories`, insertCategoryDTO);
  }
}
