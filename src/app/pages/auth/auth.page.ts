import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';
import { getErrorMessage } from '../../core/utils/error.util';

type AuthMode = 'login' | 'signup' | 'otp';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class AuthPage {
  mode: AuthMode = 'login';
  loading = false;
  errorMessage = '';
  successMessage = '';

  fullName = '';
  email = '';
  mobileNumber = '';
  countryCode = '+91';
  otp = '';
  lastOtpPreview = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  onModeChange(value: string | number | undefined): void {
    this.mode = (value as AuthMode) || 'login';
    this.errorMessage = '';
    this.successMessage = '';
  }

  submit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.mode === 'login') {
      this.authService.login({ mobileNumber: this.mobileNumber.trim() }).subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.loading = false;
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          this.errorMessage = getErrorMessage(err, 'Login failed.');
          this.loading = false;
        },
      });
      return;
    }

    if (this.mode === 'signup') {
      this.authService
        .signup({
          fullName: this.fullName.trim(),
          email: this.email.trim() || null,
          mobileNumber: this.mobileNumber.trim(),
          countryCode: this.countryCode.trim() || '+91',
        })
        .subscribe({
          next: (res) => {
            this.successMessage = res.message;
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            this.errorMessage = getErrorMessage(err, 'Signup failed.');
            this.loading = false;
          },
        });
      return;
    }

    this.authService.verifyOtp({ mobileNumber: this.mobileNumber.trim(), otp: this.otp.trim() }).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.errorMessage = getErrorMessage(err, 'OTP verification failed.');
        this.loading = false;
      },
    });
  }

  sendOtp(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .sendOtp({
        mobileNumber: this.mobileNumber.trim(),
        countryCode: this.countryCode.trim() || '+91',
        fullName: this.fullName.trim() || 'User',
        email: this.email.trim() || null,
      })
      .subscribe({
        next: (res) => {
          this.lastOtpPreview = res.data.otp || '';
          this.successMessage = `${res.message} Expires: ${new Date(res.data.expiresAt).toLocaleString()}`;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = getErrorMessage(err, 'Failed to send OTP.');
          this.loading = false;
        },
      });
  }
}
