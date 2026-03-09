import { Component } from '@angular/core';
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
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
  ],
})
export class DashboardPage {
  showOnboardingButton = true;

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
}
