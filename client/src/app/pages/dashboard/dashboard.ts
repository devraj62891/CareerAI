import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Analysis } from '../../services/api';
import { Logo } from '../../components/logo';
import { ThemeToggle } from '../../components/theme-toggle';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, Logo, ThemeToggle],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  // Step 1 — upload
  selectedFile: File | null = null;
  resumeId = signal('');
  fileName = signal('');
  uploading = signal(false);

  // Resume history
  resumes = signal<{ _id: string; fileName: string; createdAt: string }[]>([]);
  loadingResumes = signal(false);

  // Step 2 — analyze
  targetCompany = '';
  jobDescription = '';
  analyzing = signal(false);
  analyzingStep = signal('Analyzing…');

  // Step 3 — results
  analysis = signal<Analysis | null>(null);
  error = signal('');

  // Load resume history on component init
  ngOnInit(): void {
    this.loadResumes();
  }

  loadResumes(): void {
    this.loadingResumes.set(true);
    this.api.getResumes().subscribe({
      next: (res) => {
        this.loadingResumes.set(false);
        this.resumes.set(res.resumes);
      },
      error: () => {
        this.loadingResumes.set(false);
      },
    });
  }

  // Select a resume from history — skips upload step
  selectResume(resume: { _id: string; fileName: string; createdAt: string }): void {
    this.resumeId.set(resume._id);
    this.fileName.set(resume.fileName);
    this.analysis.set(null);
    this.error.set('');
  }

  // Format date nicely
  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  uploadResume(): void {
    if (!this.selectedFile) {
      this.error.set('Please choose a PDF file first.');
      return;
    }
    this.error.set('');
    this.uploading.set(true);

    this.api.uploadResume(this.selectedFile).subscribe({
      next: (res) => {
        this.uploading.set(false);
        this.resumeId.set(res.resume.id);
        this.fileName.set(res.resume.fileName);
        this.loadResumes(); // refresh history after upload
      },
      error: (err) => {
        this.uploading.set(false);
        this.error.set(err?.error?.message || 'Upload failed');
      },
    });
  }

  analyze(): void {
    if (!this.resumeId()) {
      this.error.set('Please upload or select a resume first.');
      return;
    }
    if (!this.targetCompany.trim()) {
      this.error.set('Please enter a target company.');
      return;
    }
    this.error.set('');
    this.analyzing.set(true);
    this.analysis.set(null);

    const steps = [
      '📄 Parsing resume…',
      '📊 Scoring ATS…',
      '🔍 Analyzing gaps…',
      '❓ Generating questions…',
    ];
    let i = 0;
    this.analyzingStep.set(steps[0]);
    const interval = setInterval(() => {
      i = (i + 1) % steps.length;
      this.analyzingStep.set(steps[i]);
    }, 3000);

    this.api.analyze(this.resumeId(), this.targetCompany, this.jobDescription).subscribe({
      next: (res) => {
        clearInterval(interval);
        this.analyzing.set(false);
        this.analysis.set(res.analysis);
      },
      error: (err) => {
        clearInterval(interval);
        this.analyzing.set(false);
        this.error.set(err?.error?.message || 'Analysis failed');
      },
    });
  }

  getReadinessClass(readiness: string): string {
    if (!readiness) return '';
    const r = readiness.toLowerCase();
    if (r.includes('not')) return 'readiness-badge readiness-not';
    if (r.includes('partial')) return 'readiness-badge readiness-partial';
    return 'readiness-badge readiness-ready';
  }

  getScoreClass(score: number): string {
    if (score >= 70) return 'score-circle score-high';
    if (score >= 40) return 'score-circle score-mid';
    return 'score-circle score-low';
  }

  logout(): void {
    this.api.logout();
    this.router.navigate(['/login']);
  }
}