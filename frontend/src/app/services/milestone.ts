import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MilestoneService {
  private baseUrl = 'https://localhost:7272/api/projects';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
    };
  }

  getMilestones(projectId: number) {
    return this.http.get(
      `${this.baseUrl}/${projectId}/milestones`,
      this.getHeaders()
    );
  }

  addMilestone(projectId: number, data: any) {
    return this.http.post(
      `${this.baseUrl}/${projectId}/milestones`,
      data,
      this.getHeaders()
    );
  }

  deleteMilestone(projectId: number, milestoneId: number) {
    return this.http.delete(
      `${this.baseUrl}/${projectId}/milestones/${milestoneId}`,
      this.getHeaders()
    );
  }
}