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
import { PronunciationTip } from '../../core/models/api.models';
import { OnboardingService } from '../../core/services/onboarding.service';
import { NotificationService } from '../../core/services/notification.service';
import { getErrorMessage } from '../../core/utils/error.util';

type DifficultyLevel = 'Simple' | 'Intermediate' | 'Advanced';

@Component({
  selector: 'app-pronunciation-tips',
  templateUrl: './pronunciation-tips.page.html',
  styleUrls: ['./pronunciation-tips.page.scss'],
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
export class PronunciationTipsPage implements OnInit {
  tips: PronunciationTip[] = [];
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

  ngOnInit(): void {
    // Data load is handled in ionViewWillEnter.
  }

  ionViewWillEnter(): void {
    this.currentDay = 1;
    this.fetchTips(1);
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }

  previousDay(): void {
    if (this.currentDay <= 1 || this.loading) {
      return;
    }
    this.fetchTips(this.currentDay - 1);
  }

  nextDay(): void {
    if (this.currentDay >= this.totalDays || this.loading) {
      return;
    }
    this.fetchTips(this.currentDay + 1);
  }

  goToDayOne(): void {
    if (this.loading) {
      return;
    }
    this.currentDay = 1;
    this.fetchTips(1);
  }

  speakTip(tip: PronunciationTip): void {
    const speechText = `Tip. ${tip.title}. Guide. ${tip.guide}. Example. ${tip.example}.`;
    this.speakText(speechText);
  }

  speakAll(): void {
    if (!this.tips.length) {
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      void this.notificationService.error('Text-to-speech is not supported on this device/browser.');
      return;
    }

    this.stopSpeaking();
    this.speakingAll = true;

    this.tips.forEach((tip, index) => {
      const utterance = new SpeechSynthesisUtterance(
        `Tip ${index + 1}. ${tip.title}. Guide. ${tip.guide}. Example. ${tip.example}.`,
      );
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      if (index === this.tips.length - 1) {
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

  private fetchTips(day?: number): void {
    const requestedDay = day ?? 1;
    this.loading = true;
    this.onboardingService.getPronunciationTips(requestedDay).subscribe({
      next: (res) => {
        this.dayNumber = res.data.dayNumber;
        this.currentDay = res.data.dayNumber;
        this.totalDays = res.data.totalDays;
        this.level = res.data.level;
        this.tips = res.data.tips || [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        void this.notificationService.error(getErrorMessage(error, 'Failed to load pronunciation tips.'));
      },
    });
  }
}
