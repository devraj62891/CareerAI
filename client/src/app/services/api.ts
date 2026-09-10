//remember An Injector is an Angular object that stores and provides services.

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * ApiService — the ONLY file that talks to the backend.
 * Every screen calls methods here instead of using HttpClient directly.
 * This keeps all URLs and the auth token in one easy-to-find place.
 */

// Change this if your backend runs on a different port/host.
// const API = 'http://localhost:3000/api';
const API = 'https://careerai-baceknd.onrender.com/api';

// ---- Shapes of the data the backend sends back ----

export interface Candidate {
  fullName: string;
  currentRole: string;
  totalExperience: string;
  skills: string[];
  summary: string;
}

export interface Weakness {
  area: string;
  description: string;
  howToImprove: string;
}

export interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
  targetArea?: string;
  whyAsked?: string;
}

export interface Analysis {
  // From Agent 1
  candidate?: {
    fullName: string;
    currentRole: string;
    totalExperience: string;
    skills: string[];
    summary: string;
  };
  // From Agent 2
  atsScore: number;
  atsFeedback: string;
  keywordsMatched?: string[];
  keywordsMissing?: string[];
  formatFeedback?: string;
  // From Agent 3
  weaknesses: Weakness[];
  missingSkills?: string[];
  experienceGaps?: string;
  overallReadiness?: string;
  priorityActions?: string[];
  // From Agent 4
  interviewQuestions: InterviewQuestion[];
  focusAreas?: string[];
  interviewTips?: string;
  // Legacy
  strengths?: string[];
  overallFeedback?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // The logged-in user's token. We keep a copy in localStorage so a page
  // refresh doesn't log the user out. `signal` lets components react to it.
  token = signal<string>(localStorage.getItem('token') || '');

  // Are we logged in right now?
  isLoggedIn(): boolean {
    return this.token().length > 0;
  }

  // Save token after login, and remember it for next time.
  private setToken(token: string): void {
    this.token.set(token);
    localStorage.setItem('token', token);
  }

  logout(): void {
    this.token.set('');
    localStorage.removeItem('token');
  }

  // Builds the "Authorization: Bearer <token>" header for protected routes.
  private authHeaders(): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.token()}` }) };
  }

  // ---- AUTH ----

  signup(name: string, email: string, password: string) {
    return this.http.post<{ message: string }>(`${API}/auth/signup`, {
      name,
      email,
      password,
    });
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: any }>(`${API}/auth/login`, {
      email,
      password,
    });
  }

  // Called by the login component once it has the token from login().
  saveLogin(token: string): void {
    this.setToken(token);
  }

  // ---- RESUME UPLOAD ----
  uploadResume(file: File) {
    const form = new FormData();
    form.append('resume', file);
    return this.http.post<{ resume: { id: string; fileName: string; textPreview: string } }>(
      `${API}/resume/upload`,
      form,
      this.authHeaders(),
    );
  }

  // ---- ANALYSIS ----
  analyze(resumeId: string, targetCompany: string, jobDescription: string = '') {
    return this.http.post<{ fileName: string; targetCompany: string; analysis: Analysis }>(
      `${API}/analysis/analyze`,
      { resumeId, targetCompany, jobDescription },
      this.authHeaders(),
    );
  }

  // Get all resumes for the logged-in user
    getResumes() {
      return this.http.get<{ resumes: { _id: string; fileName: string; createdAt: string }[] }>(
        `${API}/resume`,
        this.authHeaders(),
      );
    }
}