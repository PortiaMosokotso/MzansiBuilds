import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {
  private baseUrl = 'https://localhost:7272/api/dashboard';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getInsights() {
    return this.http.get(`${this.baseUrl}/insights`, this.getHeaders());
  }
}