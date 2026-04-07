import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CollaborationRequest {
  private baseUrl = 'https://localhost:7272/api/collaborationrequests';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  raiseHand(projectId: number, message: string) {
    return this.http.post(
      `${this.baseUrl}/${projectId}`,
      JSON.stringify(message),
      {
        headers: this.getHeaders().set('Content-Type', 'application/json'),
      }
    );
  }

  getIncomingRequests() {
    return this.http.get(`${this.baseUrl}/incoming`, {
      headers: this.getHeaders(),
    });
  }

  acceptRequest(id: number) {
    return this.http.patch(
      `${this.baseUrl}/${id}/accept`,
      {},
      { headers: this.getHeaders() }
    );
  }

  declineRequest(id: number) {
    return this.http.patch(
      `${this.baseUrl}/${id}/decline`,
      {},
      { headers: this.getHeaders() }
    );
  }
}