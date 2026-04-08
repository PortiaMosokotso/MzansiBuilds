import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Dashboard as DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  loading = true;
  insights: any;

  doughnutChartType = 'doughnut' as const;
  barChartType = 'bar' as const;

  stageChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Planning', 'In Progress', 'Testing', 'Completed'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#3b82f6', '#ecbf42', '#d1f11b', '#1da87a'],
      borderWidth: 0,
      hoverOffset: 6
    }]
  };

  stageChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          font: { size: 12 }
        }
      }
    },
    cutout: '70%'
  };

  requestChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Pending', 'Accepted', 'Declined'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#f59e0b', '#22c55e', '#ef4444'],
      borderRadius: 8,
      borderWidth: 0
    }]
  };

  requestChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: '#f1f5f9' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInsights();
  }

  loadInsights() {
    this.loading = true;
    this.dashboardService.getInsights().subscribe({
      next: (res: any) => {
        console.log('Dashboard insights:', res);
        this.insights = res;

        this.stageChartData = {
          labels: ['Planning', 'In Progress', 'Testing', 'Completed'],
          datasets: [{
            data: [
              res.stageStats?.planning ?? 0,
              res.stageStats?.inProgress ?? 0,
              res.stageStats?.testing ?? 0,
              res.stageStats?.completed ?? 0,
            ],
            backgroundColor: ['blue', 'orange', 'yellow', 'Green'],
            borderWidth: 0,
            hoverOffset: 6
          }]
        };

        this.requestChartData = {
          labels: ['Pending', 'Accepted', 'Declined'],
          datasets: [{
            data: [
              res.pendingRequests ?? 0,
              res.acceptedRequests ?? 0,
              res.declinedRequests ?? 0,
            ],
            backgroundColor: ['orange', 'Green', 'Red'],
            borderRadius: 8,
            borderWidth: 0
          }]
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Dashboard load failed', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goToProjects() { this.router.navigate(['/projects']); }
  goToCreateProject() { this.router.navigate(['/create-project']); }

  getStageName(stage: number): string {
    return ['Planning', 'In Progress', 'Testing', 'Completed'][stage] || 'Unknown';
  }
}