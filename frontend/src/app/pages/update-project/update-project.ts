import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Project } from '../../services/project';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-update-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-project.html',
  styleUrl: './update-project.css',
})
export class UpdateProject implements OnInit, OnDestroy {
  projectId!: number;
  loading = true;
  saving = false;
  error = false;
  errorMessage = '';
  successMessage = '';
  project: any = null;

  private subs: Subscription[] = [];

  stages = [
    { key: 0, label: 'Planning'    },
    { key: 1, label: 'In Progress' },
    { key: 2, label: 'Testing'     },
    { key: 3, label: 'Completed'   },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: Project,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const paramSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id || isNaN(Number(id))) {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }
      this.projectId = Number(id);
      this.resetState();
      this.loadProject();
    });

    const navSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && Number(id) !== this.projectId) {
          this.projectId = Number(id);
          this.resetState();
          this.loadProject();
        }
      });

    this.subs.push(paramSub, navSub);
  }

  resetState(): void {
    this.project = null;
    this.loading = true;
    this.error = false;
    this.errorMessage = '';
    this.saving = false;
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  loadProject(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response: any) => {
        this.project = {
          title: response.title,
          description: response.description,
          stage: Number(response.stage),
          supportRequired: response.supportRequired,
          supportDetails: response.supportDetails || '',
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load project:', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  saveProject(form: NgForm): void {
    this.errorMessage = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.saving = true;
    this.successMessage = '';
    this.cdr.detectChanges();

    this.projectService.updateProject(this.projectId, this.project).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Project updated successfully!';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/projects']), 1200);
      },
      error: (err) => {
        console.error('Failed to update project:', err);
        this.saving = false;
        this.errorMessage = err.error?.message || 'Failed to update project. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}