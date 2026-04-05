import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../services/project';
import { MilestoneService } from '../../services/milestone';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail implements OnInit {
  projectId!: number;
  project: any = null;
  milestones: any[] = [];
  loading = true;
  error = false;
  addingMilestone = false;
  savingMilestone = false;

  // Logged in user id from token
  currentUserId: number | null = null;

  newMilestone = {
    title: '',
    description: ''
  };

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
    private route: ActivatedRoute,
    private router: Router,
    private projectService: Project,
    private milestoneService: MilestoneService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.getCurrentUserId();
    this.loadProject();
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

  get isOwner(): boolean {
    return this.project?.userId === this.currentUserId;
  }

  loadProject(): void {
    this.loading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response: any) => {
        this.project = response;
        this.loading = false;
        this.cdr.detectChanges();
        this.loadMilestones();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMilestones(): void {
    this.milestoneService.getMilestones(this.projectId).subscribe({
      next: (response: any) => {
        this.milestones = Array.isArray(response) ? response : [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load milestones', err)
    });
  }

  getStageName(stage: number): string {
    return this.stageMap[stage] ?? 'Unknown';
  }

  getStageClass(stage: number): string {
    return this.stageColors[stage] ?? 'planning';
  }

  toggleAddMilestone(): void {
    this.addingMilestone = !this.addingMilestone;
    this.newMilestone = { title: '', description: '' };
    this.cdr.detectChanges();
  }

  submitMilestone(): void {
    if (!this.newMilestone.title.trim() ||
        !this.newMilestone.description.trim()) return;

    this.savingMilestone = true;
    this.milestoneService
      .addMilestone(this.projectId, this.newMilestone)
      .subscribe({
        next: (response: any) => {
          this.milestones.push(response);
          this.savingMilestone = false;
          this.addingMilestone = false;
          this.newMilestone = { title: '', description: '' };
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to add milestone', err);
          this.savingMilestone = false;
          this.cdr.detectChanges();
        }
      });
  }

  deleteMilestone(milestoneId: number): void {
    if (!confirm('Delete this milestone?')) return;
    this.milestoneService
      .deleteMilestone(this.projectId, milestoneId)
      .subscribe({
        next: () => {
          this.milestones = this.milestones.filter(
            m => m.id !== milestoneId
          );
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to delete milestone', err)
      });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}