import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';
import { getErrorMessage } from '../../core/utils/error.util';
import { NotificationService } from '../../core/services/notification.service';

type AuthMode = 'login' | 'signup';

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
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
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
  forgotPasswordMode = false;

  fullName = '';
  email = '';
  loginId = '';
  mobileNumber = '';
  countryCode = '+91';
  password = '';
  confirmPassword = '';
  otp = '';
  lastOtpPreview = '';
  resetEmail = '';
  resetPasswordValue = '';
  resetConfirmPassword = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {}

  onModeChange(value: string | number | undefined): void {
    this.mode = (value as AuthMode) || 'login';
    this.forgotPasswordMode = false;
    this.lastOtpPreview = '';
  }

  submit(): void {
    if (this.mode === 'signup' && this.password !== this.confirmPassword) {
      void this.notificationService.error('Passwords do not match.');
      return;
    }

    this.loading = true;

    if (this.mode === 'login') {
      this.authService.login({ loginId: this.loginId.trim(), password: this.password }).subscribe({
        next: (res) => {
          void this.notificationService.success(res.message);
          this.loading = false;
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          void this.notificationService.error(getErrorMessage(err, 'Login failed.'));
          this.loading = false;
        },
      });
      return;
    }

    if (this.mode === 'signup') {
      this.authService
        .signup({
          fullName: this.fullName.trim(),
          email: this.email.trim(),
          mobileNumber: this.mobileNumber.trim(),
          password: this.password,
          countryCode: this.countryCode.trim() || '+91',
        })
        .subscribe({
          next: (res) => {
            void this.notificationService.success(res.message);
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            void this.notificationService.error(getErrorMessage(err, 'Signup failed.'));
            this.loading = false;
          },
        });
      return;
    }

    this.loading = false;
  }

  sendResetOtp(): void {
    this.loading = true;
    this.authService.requestPasswordReset({ email: this.resetEmail.trim() }).subscribe({
      next: (res) => {
        this.lastOtpPreview = res.data.otp || '';
        void this.notificationService.info(
          `${res.message} Expires: ${new Date(res.data.expiresAt).toLocaleString()}`,
        );
        if (res.data.previewMessage) {
          void this.notificationService.info(res.data.previewMessage);
        }
        this.loading = false;
      },
      error: (err) => {
        void this.notificationService.error(getErrorMessage(err, 'Failed to send reset OTP.'));
        this.loading = false;
      },
    });
  }

  resetPassword(): void {
    if (this.resetPasswordValue !== this.resetConfirmPassword) {
      void this.notificationService.error('Passwords do not match.');
      return;
    }

    this.loading = true;
    this.authService
      .resetPassword({
        email: this.resetEmail.trim(),
        otp: this.otp.trim(),
        password: this.resetPasswordValue,
      })
      .subscribe({
        next: (res) => {
          void this.notificationService.success(res.message);
          this.loading = false;
          this.forgotPasswordMode = false;
          this.mode = 'login';
          this.password = '';
          this.otp = '';
          this.resetPasswordValue = '';
          this.resetConfirmPassword = '';
        },
        error: (err) => {
          void this.notificationService.error(getErrorMessage(err, 'Failed to reset password.'));
          this.loading = false;
        },
      });
  }

  toggleForgotPassword(): void {
    this.forgotPasswordMode = !this.forgotPasswordMode;
    this.lastOtpPreview = '';
  }

}
