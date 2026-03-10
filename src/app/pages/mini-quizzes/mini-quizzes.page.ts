import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { MiniQuiz } from '../../core/models/api.models';
import { OnboardingService } from '../../core/services/onboarding.service';
import { NotificationService } from '../../core/services/notification.service';
import { getErrorMessage } from '../../core/utils/error.util';

type DifficultyLevel = 'Simple' | 'Intermediate' | 'Advanced';

@Component({
  selector: 'app-mini-quizzes',
  templateUrl: './mini-quizzes.page.html',
  styleUrls: ['./mini-quizzes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
  ],
})
export class MiniQuizzesPage implements OnInit {
  dayNumber = 1;
  currentDay = 1;
  totalDays = 100;
  level: DifficultyLevel = 'Simple';
  loading = false;
  selectedOptionIndex: number | null = null;
  submitted = false;
  isCorrect = false;
  quiz: MiniQuiz = {
    question: '',
    options: [],
    correctAnswerIndex: 0,
    explanation: '',
  };

  constructor(
    private readonly router: Router,
    private readonly onboardingService: OnboardingService,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.currentDay = 1;
    this.fetchQuiz(1);
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }

  previousDay(): void {
    if (this.currentDay <= 1 || this.loading) {
      return;
    }
    this.fetchQuiz(this.currentDay - 1);
  }

  nextDay(): void {
    if (this.currentDay >= this.totalDays || this.loading) {
      return;
    }
    this.fetchQuiz(this.currentDay + 1);
  }

  goToDayOne(): void {
    if (this.loading) {
      return;
    }
    this.currentDay = 1;
    this.fetchQuiz(1);
  }

  selectOption(index: number): void {
    if (this.submitted) {
      return;
    }
    this.selectedOptionIndex = index;
  }

  submitAnswer(): void {
    if (this.selectedOptionIndex === null) {
      void this.notificationService.error('Please select an option first.');
      return;
    }
    this.submitted = true;
    this.isCorrect = this.selectedOptionIndex === this.quiz.correctAnswerIndex;
  }

  resetAnswer(): void {
    this.selectedOptionIndex = null;
    this.submitted = false;
    this.isCorrect = false;
  }

  speakQuestion(): void {
    this.speakText(`Question. ${this.quiz.question}. Options. ${this.quiz.options.join('. ')}`);
  }

  speakAll(): void {
    const text = `Question. ${this.quiz.question}. Options. ${this.quiz.options
      .map((option, index) => `Option ${index + 1}. ${option}.`)
      .join(' ')} Explanation. ${this.quiz.explanation}.`;
    this.speakText(text);
  }

  private speakText(text: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      void this.notificationService.error('Text-to-speech is not supported on this device/browser.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  private fetchQuiz(day?: number): void {
    const requestedDay = day ?? 1;
    this.loading = true;
    this.resetAnswer();
    this.onboardingService.getMiniQuiz(requestedDay).subscribe({
      next: (res) => {
        this.dayNumber = res.data.dayNumber;
        this.currentDay = res.data.dayNumber;
        this.totalDays = res.data.totalDays;
        this.level = res.data.level;
        this.quiz = res.data.quiz;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        void this.notificationService.error(getErrorMessage(error, 'Failed to load mini quiz.'));
      },
    });
  }
}
