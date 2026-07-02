import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/profiles`;

  getProfiles(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
  createProfile(data: any): Observable<any> { return this.http.post<any>(this.apiUrl, data); }
  updateProfile(id: string, data: any): Observable<any> { return this.http.put<any>(`${this.apiUrl}/${id}`, data); }
  deleteProfile(id: string): Observable<any> { return this.http.delete<any>(`${this.apiUrl}/${id}`); }
  exportPdf(): Observable<Blob> { return this.http.get(`${this.apiUrl}/export/pdf`, { responseType: 'blob' }); }
  exportExcel(): Observable<Blob> { return this.http.get(`${this.apiUrl}/export/excel`, { responseType: 'blob' }); }
}