import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';
import { OnboardingService } from '../../core/services/onboarding.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
  ],
})
export class DashboardPage {
  showOnboardingButton = true;
  readonly user = this.authService.getCurrentUser();
  readonly quickLinks = [
    { title: 'AI Mentor', subtitle: 'Ask, learn, improve', route: '/mentor', accent: 'sunrise' },
    { title: 'Conversation', subtitle: 'Practice live speaking', route: '/conversation', accent: 'lagoon' },
    { title: 'Speech Lab', subtitle: 'Train with voice tools', route: '/speech', accent: 'ember' },
    { title: 'Vocabulary', subtitle: 'Daily words and memory', route: '/daily-vocabulary', accent: 'mint' },
    { title: 'Grammar', subtitle: 'Clear rules and examples', route: '/grammar-lessons', accent: 'sunrise' },
    { title: 'Sentences', subtitle: 'Useful daily English', route: '/common-sentences', accent: 'lagoon' },
    { title: 'Scripts', subtitle: 'Predefined dialogues', route: '/conversation-scripts', accent: 'ember' },
    { title: 'Pronunciation', subtitle: 'Sound more natural', route: '/pronunciation-tips', accent: 'mint' },
    { title: 'Learning Tips', subtitle: 'Smart practice habits', route: '/english-learning-tips', accent: 'sunrise' },
    { title: 'Mini Quizzes', subtitle: 'Fast MCQ revision', route: '/mini-quizzes', accent: 'lagoon' },
    { title: 'Idioms', subtitle: 'Speak more naturally', route: '/english-idioms', accent: 'ember' },
    { title: 'Word of the Day', subtitle: 'One strong word daily', route: '/word-of-the-day', accent: 'mint' },
    { title: 'Motivation', subtitle: 'Stay consistent daily', route: '/motivational-messages', accent: 'sunrise' },
  ];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly onboardingService: OnboardingService,
  ) {
    this.showOnboardingButton = !this.authService.getCurrentUser()?.onboardingCompleted;
  }

  ionViewWillEnter(): void {
    this.refreshOnboardingVisibility();
  }

  private refreshOnboardingVisibility(): void {
    const completedInUser = !!this.authService.getCurrentUser()?.onboardingCompleted;
    this.showOnboardingButton = !completedInUser;

    this.onboardingService.getMyAnswers().subscribe({
      next: (res) => {
        const hasSubmittedAnswer = (res.data?.length ?? 0) > 0;
        this.showOnboardingButton = !(completedInUser || hasSubmittedAnswer);
      },
      error: () => {
        this.showOnboardingButton = !completedInUser;
      },
    });
  }

  go(path: string): void {
    this.router.navigateByUrl(path);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

  get firstName(): string {
    return this.user?.fullName?.trim().split(/\s+/)[0] || 'Learner';
  }

  get userInitials(): string {
    const parts = this.user?.fullName?.trim().split(/\s+/).filter(Boolean) || [];
    return (parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U').slice(0, 2);
  }
}
