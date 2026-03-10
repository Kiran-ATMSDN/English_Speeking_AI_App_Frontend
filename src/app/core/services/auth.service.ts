import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthPayload, OtpPayload, User } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'esaa_token';
  private readonly userKey = 'esaa_user';
  private readonly userSubject = new BehaviorSubject<User | null>(this.readStoredUser());

  readonly user$ = this.userSubject.asObservable();

  constructor(private readonly api: ApiService) {}

  signup(payload: {
    fullName: string;
    email: string;
    mobileNumber: string;
    password: string;
    countryCode?: string;
  }): Observable<{ success: boolean; message: string; data: AuthPayload }> {
    return this.api.post<AuthPayload>('/auth/signup', payload).pipe(tap((res) => this.setSession(res.data)));
  }

  login(payload: {
    loginId: string;
    password: string;
  }): Observable<{ success: boolean; message: string; data: AuthPayload }> {
    return this.api.post<AuthPayload>('/auth/login', payload).pipe(tap((res) => this.setSession(res.data)));
  }

  sendOtp(payload: {
    mobileNumber: string;
    countryCode?: string;
    fullName?: string;
    email?: string | null;
  }): Observable<{ success: boolean; message: string; data: OtpPayload }> {
    return this.api.post<OtpPayload>('/auth/send-otp', payload);
  }

  verifyOtp(payload: {
    mobileNumber: string;
    otp: string;
  }): Observable<{ success: boolean; message: string; data: AuthPayload }> {
    return this.api.post<AuthPayload>('/auth/verify-otp', payload).pipe(tap((res) => this.setSession(res.data)));
  }

  requestPasswordReset(payload: { email: string }) {
    return this.api.post<OtpPayload>('/auth/request-password-reset', payload);
  }

  resetPassword(payload: { email: string; otp: string; password: string }) {
    return this.api.post<{ email: string }>('/auth/reset-password', payload);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  updateCurrentUser(payload: Partial<User>): void {
    const currentUser = this.userSubject.value;
    if (!currentUser) {
      return;
    }

    const updatedUser = { ...currentUser, ...payload };
    localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    this.userSubject.next(updatedUser);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  private setSession(payload: AuthPayload): void {
    localStorage.setItem(this.tokenKey, payload.token);
    localStorage.setItem(this.userKey, JSON.stringify(payload.user));
    this.userSubject.next(payload.user);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
