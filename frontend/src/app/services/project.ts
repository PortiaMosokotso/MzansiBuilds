import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Project {
  private baseUrl = 'https://localhost:7272/api/projects';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  // CREATE
  createProject(data: any) {
    return this.http.post(this.baseUrl, data, this.getHeaders());
  }

  // GET ALL
  getAllProjects() {
    return this.http.get(this.baseUrl, this.getHeaders());
  }

  // GET SINGLE
  getProjectById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  // UPDATE
  updateProject(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data, this.getHeaders());
  }

  // DELETE
  deleteProject(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeaders());
  }
}
