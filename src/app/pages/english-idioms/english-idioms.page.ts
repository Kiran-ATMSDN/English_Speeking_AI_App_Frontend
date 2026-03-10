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
import { EnglishIdiom } from '../../core/models/api.models';
import { OnboardingService } from '../../core/services/onboarding.service';
import { NotificationService } from '../../core/services/notification.service';
import { getErrorMessage } from '../../core/utils/error.util';

type DifficultyLevel = 'Simple' | 'Intermediate' | 'Advanced';

@Component({
  selector: 'app-english-idioms',
  templateUrl: './english-idioms.page.html',
  styleUrls: ['./english-idioms.page.scss'],
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
export class EnglishIdiomsPage implements OnInit {
  idioms: EnglishIdiom[] = [];
  dayNumber = 1;
  currentDay = 1;
  totalDays = 100;
  level: DifficultyLevel = 'Simple';
  loading = false;
  speakingAll = false;

  constructor(
    private readonly router: Router,
    private readonly onboardingService: OnboardingService,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.currentDay = 1;
    this.fetchIdioms(1);
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }

  previousDay(): void {
    if (this.currentDay <= 1 || this.loading) {
      return;
    }
    this.fetchIdioms(this.currentDay - 1);
  }

  nextDay(): void {
    if (this.currentDay >= this.totalDays || this.loading) {
      return;
    }
    this.fetchIdioms(this.currentDay + 1);
  }

  goToDayOne(): void {
    if (this.loading) {
      return;
    }
    this.currentDay = 1;
    this.fetchIdioms(1);
  }

  speakIdiom(item: EnglishIdiom): void {
    this.speakText(
      `Idiom. ${item.idiom}. Meaning. ${item.meaning}. Hindi meaning. ${item.meaningHi}. Example. ${item.example}.`,
    );
  }

  speakAll(): void {
    if (!this.idioms.length) {
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      void this.notificationService.error('Text-to-speech is not supported on this device/browser.');
      return;
    }

    this.stopSpeaking();
    this.speakingAll = true;
    this.idioms.forEach((item, index) => {
      const utterance = new SpeechSynthesisUtterance(
        `Idiom ${index + 1}. ${item.idiom}. Meaning. ${item.meaning}. Hindi meaning. ${item.meaningHi}. Example. ${item.example}.`,
      );
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      if (index === this.idioms.length - 1) {
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

  private fetchIdioms(day?: number): void {
    const requestedDay = day ?? 1;
    this.loading = true;
    this.onboardingService.getEnglishIdioms(requestedDay).subscribe({
      next: (res) => {
        this.dayNumber = res.data.dayNumber;
        this.currentDay = res.data.dayNumber;
        this.totalDays = res.data.totalDays;
        this.level = res.data.level;
        this.idioms = res.data.idioms || [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        void this.notificationService.error(getErrorMessage(error, 'Failed to load English idioms.'));
      },
    });
  }
}
