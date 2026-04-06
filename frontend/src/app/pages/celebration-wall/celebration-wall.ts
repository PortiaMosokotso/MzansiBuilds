import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Project } from '../../services/project';

@Component({
  selector: 'app-celebration-wall',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './celebration-wall.html',
  styleUrl: './celebration-wall.css',
})
export class CelebrationWall implements OnInit {
  projects: any[] = [];
  loading = true;
  error = false;

  constructor(
    private projectService: Project,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompleted();
  }

  loadCompleted(): void {
    this.loading = true;
    this.projectService.getCompletedProjects().subscribe({
      next: (response: any) => {
        this.projects = Array.isArray(response) ? response : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load celebration wall', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewProject(id: number): void {
    this.router.navigate(['/project', id]);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }

  getDuration(createdAt: string, updatedAt: string): string {
    const start = new Date(createdAt);
    const end = new Date(updatedAt);
    const days = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return 'Same day';
    if (days === 1) return '1 day';
    if (days < 30) return `${days} days`;
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month' : `${months} months`;
  }
}