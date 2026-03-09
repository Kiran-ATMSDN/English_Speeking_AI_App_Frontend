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
export class DailyVocabularyPage implements OnInit {
  words: DailyVocabularyWord[] = [];
  dayNumber = 1;
  currentDay = 1;
  level: DifficultyLevel = 'Simple';
  totalDays = 100;
  loading = false;
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
    // Data load is handled in ionViewWillEnter so it refreshes whenever page opens.
  }

  ionViewWillEnter(): void {
    this.fetchDailyVocabulary();
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
    this.fetchDailyVocabulary();
  }

  private fetchDailyVocabulary(day?: number): void {
    this.loading = true;
    this.onboardingService.getDailyVocabulary(day).subscribe({
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
