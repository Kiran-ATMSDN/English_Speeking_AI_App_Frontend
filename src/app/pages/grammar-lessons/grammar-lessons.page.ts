import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { GrammarLesson } from '../../core/models/api.models';
import { OnboardingService } from '../../core/services/onboarding.service';
import { NotificationService } from '../../core/services/notification.service';
import { getErrorMessage } from '../../core/utils/error.util';

type DifficultyLevel = 'Simple' | 'Intermediate' | 'Advanced';

@Component({
  selector: 'app-grammar-lessons',
  templateUrl: './grammar-lessons.page.html',
  styleUrls: ['./grammar-lessons.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonTitle,
    IonToolbar,
  ],
})
export class GrammarLessonsPage implements OnInit {
  dayNumber = 1;
  currentDay = 1;
  totalDays = 1;
  level: DifficultyLevel = 'Simple';
  loading = false;
  speakingLesson = false;
  lesson: GrammarLesson = {
    title: '',
    explanation: '',
    formula: '',
    examples: [],
  };

  constructor(
    private readonly router: Router,
    private readonly onboardingService: OnboardingService,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    // Data load is handled in ionViewWillEnter.
  }

  ionViewWillEnter(): void {
    this.currentDay = 1;
    this.fetchLesson(1);
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }

  previousDay(): void {
    if (this.currentDay <= 1 || this.loading) {
      return;
    }
    this.fetchLesson(this.currentDay - 1);
  }

  nextDay(): void {
    if (this.currentDay >= this.totalDays || this.loading) {
      return;
    }
    this.fetchLesson(this.currentDay + 1);
  }

  goToDayOne(): void {
    if (this.loading) {
      return;
    }
    this.currentDay = 1;
    this.fetchLesson(1);
  }

  speakLesson(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      void this.notificationService.error('Text-to-speech is not supported on this device/browser.');
      return;
    }

    if (!this.lesson.title) {
      return;
    }

    const examplesText = (this.lesson.examples || [])
      .map((x, i) => `Example ${i + 1}. ${x}`)
      .join(' ');
    const speechText = `Lesson title. ${this.lesson.title}. Explanation. ${this.lesson.explanation}. Formula. ${
      this.lesson.formula || 'Not available'
    }. ${examplesText}`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.onstart = () => {
      this.speakingLesson = true;
    };
    utterance.onend = () => {
      this.speakingLesson = false;
    };
    utterance.onerror = () => {
      this.speakingLesson = false;
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  speakExample(example: string): void {
    const text = String(example || '').trim();
    if (!text) {
      return;
    }

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

  stopSpeaking(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    this.speakingLesson = false;
  }

  private fetchLesson(day?: number): void {
    const requestedDay = day ?? 1;
    this.loading = true;
    this.onboardingService.getGrammarLessons(requestedDay).subscribe({
      next: (res) => {
        this.dayNumber = res.data.dayNumber;
        this.currentDay = res.data.dayNumber;
        this.totalDays = res.data.totalDays;
        this.level = res.data.level;
        this.lesson = res.data.lesson;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        void this.notificationService.error(
          getErrorMessage(error, 'Failed to load grammar lesson.'),
        );
      },
    });
  }
}
