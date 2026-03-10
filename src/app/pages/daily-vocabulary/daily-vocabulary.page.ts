import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { DailyVocabularyWord } from '../../core/models/api.models';
import { OnboardingService } from '../../core/services/onboarding.service';
import { NotificationService } from '../../core/services/notification.service';
import { getErrorMessage } from '../../core/utils/error.util';

type DifficultyLevel = 'Simple' | 'Intermediate' | 'Advanced';

@Component({
  selector: 'app-daily-vocabulary',
  templateUrl: './daily-vocabulary.page.html',
  styleUrls: ['./daily-vocabulary.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
  ],
})
export class DailyVocabularyPage implements OnInit {
  words: DailyVocabularyWord[] = [];
  dayNumber = 1;
  currentDay = 1;
  level: DifficultyLevel = 'Simple';
  totalDays = 100;
  loading = false;
  speakingAll = false;
  readonly todayLabel = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

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
    this.fetchDailyVocabulary(1);
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }

  previousDay(): void {
    if (this.currentDay <= 1 || this.loading) {
      return;
    }
    this.fetchDailyVocabulary(this.currentDay - 1);
  }

  nextDay(): void {
    if (this.currentDay >= this.totalDays || this.loading) {
      return;
    }
    this.fetchDailyVocabulary(this.currentDay + 1);
  }

  goToToday(): void {
    if (this.loading) {
      return;
    }
    this.currentDay = 1;
    this.fetchDailyVocabulary(1);
  }

  speakWord(item: DailyVocabularyWord): void {
    const word = String(item?.word || '').trim();
    if (!word) {
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      void this.notificationService.error('Text-to-speech is not supported on this device/browser.');
      return;
    }

    const speechText = `Word. ${word}. Meaning in English. ${item.meaningEn}. Meaning in Hindi. ${item.meaningHi}. Example. ${item.example}.`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  speakAllDetails(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      void this.notificationService.error('Text-to-speech is not supported on this device/browser.');
      return;
    }

    if (!this.words.length) {
      return;
    }

    window.speechSynthesis.cancel();
    this.speakingAll = true;

    this.words.forEach((item, index) => {
      const utterance = new SpeechSynthesisUtterance(
        `Word ${index + 1}. ${item.word}. Meaning. ${item.meaningEn}. Example. ${item.example}`,
      );
      utterance.lang = 'en-US';
      utterance.rate = 0.95;

      if (index === this.words.length - 1) {
        utterance.onend = () => {
          this.speakingAll = false;
        };
        utterance.onerror = () => {
          this.speakingAll = false;
        };
      }

      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    this.speakingAll = false;
  }

  private fetchDailyVocabulary(day?: number): void {
    const requestedDay = day ?? 1;
    this.loading = true;
    this.onboardingService.getDailyVocabulary(requestedDay).subscribe({
      next: (res) => {
        this.dayNumber = res.data.dayNumber;
        this.currentDay = res.data.dayNumber;
        this.totalDays = res.data.totalDays;
        this.level = res.data.level;
        this.words = res.data.words || [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        void this.notificationService.error(
          getErrorMessage(error, 'Failed to load daily vocabulary.'),
        );
      },
    });
  }
}
