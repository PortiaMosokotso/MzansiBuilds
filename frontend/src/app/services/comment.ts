import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Comment {
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

  getComments(projectId: number) {
    return this.http.get(
      `${this.baseUrl}/${projectId}/comments`,
      this.getHeaders()
    );
  }

  addComment(projectId: number, content: string) {
    return this.http.post(
      `${this.baseUrl}/${projectId}/comments`,
      { content },
      this.getHeaders()
    );
  }

  deleteComment(projectId: number, commentId: number) {
    return this.http.delete(
      `${this.baseUrl}/${projectId}/comments/${commentId}`,
      this.getHeaders()
    );
  }
}