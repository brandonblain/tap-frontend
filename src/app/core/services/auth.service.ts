import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  public currentUser = signal<any>(null);
  public isAuthenticated = signal<boolean>(false);
  public userPermissions = signal<string[]>([]);

  constructor() {
    const token = localStorage.getItem('tap_token');
   const storedPerms = localStorage.getItem('tap_permissions');
    
   if (token && storedPerms) {
    this.userPermissions.set(JSON.parse(storedPerms));
    this.isAuthenticated.set(true);
  }
}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.access_token) {
          localStorage.setItem('tap_token', response.access_token);
          const perms = response.user?.sections || [];
          localStorage.setItem('tap_permissions', JSON.stringify(perms));
          
          this.userPermissions.set(perms);
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  forgotPassword(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { username });
  }

  hasPermission(permission: string): boolean {
    // Signal tiene datos, evalúa de inmediato
    if (this.userPermissions().length > 0) {
      return this.userPermissions().includes(permission);
    }

    // 💡 2. Si el Signal está vacío por un F5, lee directamente del localStorage sin romper el ciclo de Angular
    const stored = localStorage.getItem('tap_permissions');
    if (stored) {
      try {
        const perms: string[] = JSON.parse(stored);
        return perms.includes(permission);
      } catch (e) {
        return false;
      }
    }

    return false;
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('tap_token');
        localStorage.removeItem('tap_permissions');
        this.userPermissions.set([]);
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('tap_token');
  }

  
}