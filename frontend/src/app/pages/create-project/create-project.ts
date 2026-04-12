import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Project } from '../../services/project';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProject {
  title = '';
  description = '';
  stage = 0;
  supportRequired = false;
  supportDetails = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private projectService: Project,
    private router: Router
  ) {}

  createProject(form: NgForm) {
    this.errorMessage = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = {
      title: this.title,
      description: this.description,
      stage: this.stage,
      supportRequired: this.supportRequired,
      supportDetails: this.supportDetails
    };

    this.projectService.createProject(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to create project. Please try again.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}