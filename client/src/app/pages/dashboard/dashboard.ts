import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Analysis } from '../../services/api';
import { Logo } from '../../components/logo';
import { ThemeToggle } from '../../components/theme-toggle';

/**
 * Dashboard — the main screen.
 * Flow: 1) pick a PDF resume -> upload it   2) type a company -> analyze
 *       3) show the AI results (score, strengths, weaknesses, questions).
 */
@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, Logo, ThemeToggle],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private api = inject(ApiService);
  private router = inject(Router);

  // Step 1 — upload
  selectedFile: File | null = null;
  resumeId = signal('');        // set after a successful upload
  fileName = signal('');
  uploading = signal(false);

  // Step 2 — analyze
  targetCompany = '';
  analyzing = signal(false);

  // Step 3 — results
  analysis = signal<Analysis | null>(null);

  error = signal('');

  // Called when the user picks a file in the <input type="file">
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
      },
      error: (err) => {
        this.uploading.set(false);
        this.error.set(err?.error?.message || 'Upload failed');
      },
    });
  }

  analyze(): void {
    if (!this.resumeId()) {
      this.error.set('Please upload a resume first.');
      return;
    }
    if (!this.targetCompany.trim()) {
      this.error.set('Please enter a target company.');
      return;
    }
    this.error.set('');
    this.analyzing.set(true);
    this.analysis.set(null);

    this.api.analyze(this.resumeId(), this.targetCompany).subscribe({
      next: (res) => {
        this.analyzing.set(false);
        this.analysis.set(res.analysis);
      },
      error: (err) => {
        this.analyzing.set(false);
        this.error.set(err?.error?.message || 'Analysis failed');
      },
    });
  }

  logout(): void {
    this.api.logout();
    this.router.navigate(['/login']);
  }
}
