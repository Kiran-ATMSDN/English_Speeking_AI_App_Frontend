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
  IonTextarea,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { OnboardingService } from '../../core/services/onboarding.service';
import { OnboardingQuestion } from '../../core/models/api.models';
import { getErrorMessage } from '../../core/utils/error.util';

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
    IonTextarea,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class OnboardingPage implements OnInit {
  loading = false;
  question: OnboardingQuestion | null = null;
  answerText = '';
  message = '';
  errorMessage = '';

  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly router: Router,
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
        this.errorMessage = getErrorMessage(err, 'Failed to load onboarding question.');
        this.loading = false;
      },
    });
  }

  saveAnswer(): void {
    if (!this.question) {
      return;
    }

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    this.onboardingService
      .saveAnswer({
        questionKey: this.question.questionKey,
        questionText: this.question.questionText,
        answerText: this.answerText.trim(),
      })
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = getErrorMessage(err, 'Failed to save onboarding answer.');
          this.loading = false;
        },
      });
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
