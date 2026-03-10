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
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { WordOfTheDay } from '../../core/models/api.models';
import { OnboardingService } from '../../core/services/onboarding.service';
import { NotificationService } from '../../core/services/notification.service';
import { getErrorMessage } from '../../core/utils/error.util';

type DifficultyLevel = 'Simple' | 'Intermediate' | 'Advanced';

@Component({
  selector: 'app-word-of-the-day',
  templateUrl: './word-of-the-day.page.html',
  styleUrls: ['./word-of-the-day.page.scss'],
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
    IonNote,
    IonTitle,
    IonToolbar,
  ],
})
export class WordOfTheDayPage implements OnInit {
  dayNumber = 1;
  currentDay = 1;
  totalDays = 100;
  level: DifficultyLevel = 'Simple';
  loading = false;
  word: WordOfTheDay = {
    word: '',
    meaningEn: '',
    meaningHi: '',
    example: '',
    tip: '',
  };

  constructor(
    private readonly router: Router,
    private readonly onboardingService: OnboardingService,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.currentDay = 1;
    this.fetchWord(1);
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }

  previousDay(): void {
    if (this.currentDay <= 1 || this.loading) {
      return;
    }
    this.fetchWord(this.currentDay - 1);
  }

  nextDay(): void {
    if (this.currentDay >= this.totalDays || this.loading) {
      return;
    }
    this.fetchWord(this.currentDay + 1);
  }

  goToDayOne(): void {
    if (this.loading) {
      return;
    }
    this.currentDay = 1;
    this.fetchWord(1);
  }

  speakWord(): void {
    this.speakText(
      `Word of the day. ${this.word.word}. Meaning in English. ${this.word.meaningEn}. Meaning in Hindi. ${this.word.meaningHi}. Example. ${this.word.example}. ${this.word.tip ? `Tip. ${this.word.tip}.` : ''}`,
    );
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

  private fetchWord(day?: number): void {
    const requestedDay = day ?? 1;
    this.loading = true;
    this.onboardingService.getWordOfTheDay(requestedDay).subscribe({
      next: (res) => {
        this.dayNumber = res.data.dayNumber;
        this.currentDay = res.data.dayNumber;
        this.totalDays = res.data.totalDays;
        this.level = res.data.level;
        this.word = res.data.word;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        void this.notificationService.error(getErrorMessage(error, 'Failed to load word of the day.'));
      },
    });
  }
}
