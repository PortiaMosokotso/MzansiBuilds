import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaborationRequest } from '../../services/collaboration-request';

@Component({
  selector: 'app-collaboration-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collaboration-requests.html',
  styleUrl: './collaboration-requests.css',
})
export class CollaborationRequests implements OnInit {
  requests: any[] = [];
  loading = true;

  constructor(
    private requestService: CollaborationRequest,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;

    this.requestService.getIncomingRequests().subscribe({
      next: (res: any) => {
        console.log('Requests response:', res);

        this.requests = Array.isArray(res) ? res : [];
        this.loading = false;

        // ✅ force UI refresh
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Requests error:', err);
        this.loading = false;

        // ✅ force UI refresh
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }

  acceptRequest(id: number) {
    this.requestService.acceptRequest(id).subscribe(() => {
      this.loadRequests();
    });
  }

  declineRequest(id: number) {
    this.requestService.declineRequest(id).subscribe(() => {
      this.loadRequests();
    });
  }

  getStatus(status: number): string {
    return ['Pending', 'Accepted', 'Declined'][status] || 'Unknown';
  }
}