import { Component, OnInit } from '@angular/core';
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
  IonItem,
  IonLabel,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { OnboardingService } from '../../core/services/onboarding.service';
import { OnboardingQuestion } from '../../core/models/api.models';
import { getErrorMessage } from '../../core/utils/error.util';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
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
    IonItem,
    IonLabel,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class OnboardingPage implements OnInit {
  loading = false;
  question: OnboardingQuestion | null = null;
  answerText = '';

  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.fetchQuestion();
  }

  fetchQuestion(): void {
    this.loading = true;
    this.onboardingService.getQuestions().subscribe({
      next: (res) => {
        this.question = res.data[0] || null;
        this.loading = false;
      },
      error: (err) => {
        void this.notificationService.error(getErrorMessage(err, 'Failed to load onboarding question.'));
        this.loading = false;
      },
    });
  }

  saveAnswer(): void {
    if (!this.question) {
      return;
    }

    this.loading = true;

    this.onboardingService
      .saveAnswer({
        questionKey: this.question.questionKey,
        questionText: this.question.questionText,
        answerText: this.answerText.trim(),
      })
      .subscribe({
        next: (res) => {
          void this.notificationService.success(res.message);
          this.authService.updateCurrentUser({
            onboardingCompleted: true,
            learningPurpose: this.answerText.trim(),
          });
          this.loading = false;
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          void this.notificationService.error(getErrorMessage(err, 'Failed to save onboarding answer.'));
          this.loading = false;
        },
      });
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
