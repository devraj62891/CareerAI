//remember An Injector is an Angular object that stores and provides services.

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * ApiService — the ONLY file that talks to the backend.
 * Every screen calls methods here instead of using HttpClient directly.
 * This keeps all URLs and the auth token in one easy-to-find place.
 */

// Change this if your backend runs on a different port/host.
const API = 'http://localhost:3000/api'; 
// const API = 'https://careerai-baceknd.onrender.com/api';


// ---- Shapes of the data the backend sends back ----
// (Just for editor autocomplete + fewer typos. Matches aiService.js exactly.)
export interface InterviewQuestion {
  question: string;
  category: string;   // Technical / Behavioral / HR
  difficulty: string; // Easy / Medium / Hard
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
  targetArea: string;
  whyAsked: string;
}

export interface Analysis {
  atsScore: number;
  atsFeedback: string;
  strengths: string[];
  weaknesses: Weakness[];   // ✅ now objects
  interviewQuestions: InterviewQuestion[];
  overallFeedback: string;
}


@Injectable({ providedIn: 'root' })   //This class can participate in Dependency Injection (DI)//here providedIn:'root' means we can inject it anwhere in the application either by inject or dependency injection
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
    // .post returns an Observable. We tap the token out of it in the component,
    // but expose a helper so the component doesn't need to know the shape.
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
  // The backend expects multipart/form-data with a field named "resume".
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
}
