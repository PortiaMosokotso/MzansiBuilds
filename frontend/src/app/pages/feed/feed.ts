import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../services/project';
import { Comment } from '../../services/comment';
import { CollaborationRequest } from '../../services/collaboration-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed implements OnInit {
  feedProjects: any[] = [];
  comments: { [key: number]: any[] } = {};
  newComments: { [key: number]: string } = {};
  openComments: { [key: number]: boolean } = {};
  raisedHands: { [key: number]: boolean } = {};
  raisingHand: { [key: number]: boolean } = {};
  loading = true;
  currentUserId: number | null = null;

  stageMap: { [key: number]: string } = {
    0: 'Planning',
    1: 'In Progress',
    2: 'Testing',
    3: 'Completed',
  };

  stageColors: { [key: number]: string } = {
    0: 'planning',
    1: 'progress',
    2: 'testing',
    3: 'completed',
  };

  constructor(
    private projectService: Project,
    private commentService: Comment,
    private collaborationService: CollaborationRequest,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUserId();
    this.loadFeed();
  }

  getCurrentUserId(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = Number(
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      );
    } catch {
      this.currentUserId = null;
    }
  }

  isMyProject(project: any): boolean {
    return project.userId === this.currentUserId;
  }

  loadFeed() {
    this.projectService.getFeed().subscribe({
      next: (res: any) => {
        this.feedProjects = Array.isArray(res) ? res : [];
        this.loading = false;
        this.feedProjects.forEach((project) => {
          this.loadComments(project.id);
          this.openComments[project.id] = false;
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Feed failed', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadComments(projectId: number) {
    this.commentService.getComments(projectId).subscribe({
      next: (res: any) => {
        this.comments[projectId] = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      },
    });
  }

  toggleComments(projectId: number): void {
    this.openComments[projectId] = !this.openComments[projectId];
    this.cdr.detectChanges();
  }

  getCommentCount(projectId: number): number {
    return this.comments[projectId]?.length || 0;
  }

  addComment(projectId: number) {
    const content = this.newComments[projectId]?.trim();
    if (!content) return;
    this.commentService.addComment(projectId, content).subscribe({
      next: () => {
        this.newComments[projectId] = '';
        this.loadComments(projectId);
      },
      error: (err) => console.error('Failed to add comment', err)
    });
  }

  deleteComment(projectId: number, commentId: number) {
  this.commentService.deleteComment(projectId, commentId).subscribe({
    next: () => {
      this.comments[projectId] = this.comments[projectId].filter(c => c.id !== commentId);
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Failed to delete comment', err)
  });
}

  raiseHand(project: any) {
    if (this.isMyProject(project)) return;
    if (this.raisedHands[project.id]) return;

    this.raisingHand[project.id] = true;
    const defaultMessage = `Hi, I would love to collaborate.`;

    this.collaborationService.raiseHand(project.id, defaultMessage).subscribe({
      next: () => {
        this.raisedHands[project.id] = true;
        this.raisingHand[project.id] = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to raise hand', err);
        this.raisingHand[project.id] = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStageName(stage: number): string {
    return this.stageMap[stage] || 'Unknown';
  }

  getStageClass(stage: number): string {
    return this.stageColors[stage] || 'planning';
  }

  getInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() || '?';
  }

   goToCreateProject() {
    this.router.navigate(['/create-project']);}
}