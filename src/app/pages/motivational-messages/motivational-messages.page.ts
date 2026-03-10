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
import { MotivationalMessage } from '../../core/models/api.models';
import { OnboardingService } from '../../core/services/onboarding.service';
import { NotificationService } from '../../core/services/notification.service';
import { getErrorMessage } from '../../core/utils/error.util';

type DifficultyLevel = 'Simple' | 'Intermediate' | 'Advanced';

@Component({
  selector: 'app-motivational-messages',
  templateUrl: './motivational-messages.page.html',
  styleUrls: ['./motivational-messages.page.scss'],
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
export class MotivationalMessagesPage implements OnInit {
  messages: MotivationalMessage[] = [];
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
    this.fetchMessages(1);
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }

  previousDay(): void {
    if (this.currentDay <= 1 || this.loading) {
      return;
    }
    this.fetchMessages(this.currentDay - 1);
  }

  nextDay(): void {
    if (this.currentDay >= this.totalDays || this.loading) {
      return;
    }
    this.fetchMessages(this.currentDay + 1);
  }

  goToDayOne(): void {
    if (this.loading) {
      return;
    }
    this.currentDay = 1;
    this.fetchMessages(1);
  }

  speakMessage(item: MotivationalMessage): void {
    this.speakText(`Message. ${item.title}. ${item.message}. ${item.takeaway ? `Takeaway. ${item.takeaway}.` : ''}`);
  }

  speakAll(): void {
    if (!this.messages.length) {
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      void this.notificationService.error('Text-to-speech is not supported on this device/browser.');
      return;
    }

    this.stopSpeaking();
    this.speakingAll = true;
    this.messages.forEach((item, index) => {
      const utterance = new SpeechSynthesisUtterance(
        `Message ${index + 1}. ${item.title}. ${item.message}. ${item.takeaway ? `Takeaway. ${item.takeaway}.` : ''}`,
      );
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      if (index === this.messages.length - 1) {
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

  private fetchMessages(day?: number): void {
    const requestedDay = day ?? 1;
    this.loading = true;
    this.onboardingService.getMotivationalMessages(requestedDay).subscribe({
      next: (res) => {
        this.dayNumber = res.data.dayNumber;
        this.currentDay = res.data.dayNumber;
        this.totalDays = res.data.totalDays;
        this.level = res.data.level;
        this.messages = res.data.messages || [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        void this.notificationService.error(getErrorMessage(error, 'Failed to load motivational messages.'));
      },
    });
  }
}
