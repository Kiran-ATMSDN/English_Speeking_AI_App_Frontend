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
import { ConversationScript, ConversationScriptLine } from '../../core/models/api.models';
import { OnboardingService } from '../../core/services/onboarding.service';
import { NotificationService } from '../../core/services/notification.service';
import { getErrorMessage } from '../../core/utils/error.util';

type DifficultyLevel = 'Simple' | 'Intermediate' | 'Advanced';

@Component({
  selector: 'app-conversation-scripts',
  templateUrl: './conversation-scripts.page.html',
  styleUrls: ['./conversation-scripts.page.scss'],
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
export class ConversationScriptsPage implements OnInit {
  dayNumber = 1;
  currentDay = 1;
  totalDays = 100;
  level: DifficultyLevel = 'Simple';
  loading = false;
  speakingAll = false;
  script: ConversationScript = {
    title: '',
    context: '',
    lines: [],
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
    this.fetchScript(1);
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }

  previousDay(): void {
    if (this.currentDay <= 1 || this.loading) {
      return;
    }
    this.fetchScript(this.currentDay - 1);
  }

  nextDay(): void {
    if (this.currentDay >= this.totalDays || this.loading) {
      return;
    }
    this.fetchScript(this.currentDay + 1);
  }

  goToDayOne(): void {
    if (this.loading) {
      return;
    }
    this.currentDay = 1;
    this.fetchScript(1);
  }

  speakLine(line: ConversationScriptLine): void {
    this.speakText(`${line.speaker}. ${line.text}`);
  }

  speakAll(): void {
    if (!this.script.lines.length) {
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      void this.notificationService.error('Text-to-speech is not supported on this device/browser.');
      return;
    }

    this.stopSpeaking();
    this.speakingAll = true;

    this.script.lines.forEach((line, index) => {
      const utterance = new SpeechSynthesisUtterance(`${line.speaker}. ${line.text}`);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      if (index === this.script.lines.length - 1) {
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

  private fetchScript(day?: number): void {
    const requestedDay = day ?? 1;
    this.loading = true;
    this.onboardingService.getConversationScripts(requestedDay).subscribe({
      next: (res) => {
        this.dayNumber = res.data.dayNumber;
        this.currentDay = res.data.dayNumber;
        this.totalDays = res.data.totalDays;
        this.level = res.data.level;
        this.script = res.data.script;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        void this.notificationService.error(
          getErrorMessage(error, 'Failed to load conversation script.'),
        );
      },
    });
  }
}
