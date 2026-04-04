import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Project {
  private baseUrl = 'https://localhost:7272/api/projects';

  constructor(private http: HttpClient) {}

  createProject(data: any) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.baseUrl, data, { headers });
  }
}
