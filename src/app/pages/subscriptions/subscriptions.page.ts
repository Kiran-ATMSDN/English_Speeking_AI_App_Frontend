import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SubscriptionPlan } from '../../core/models/api.models';
import { SubscriptionService } from '../../core/services/subscription.service';
import { getErrorMessage } from '../../core/utils/error.util';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonList,
    IonTitle,
    IonToolbar,
  ],
})
export class SubscriptionsPage implements OnInit {
  plans: SubscriptionPlan[] = [];
  currentPlan: SubscriptionPlan | null = null;
  loading = false;

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.subscriptionService.getPlans().subscribe({
      next: (res) => {
        this.plans = res.data;
        this.loading = false;
      },
      error: (err) => {
        void this.notificationService.error(getErrorMessage(err, 'Failed to load plans.'));
        this.loading = false;
      },
    });

    this.subscriptionService.getCurrent().subscribe({
      next: (res) => {
        this.currentPlan = res.data;
      },
    });
  }

  select(plan: SubscriptionPlan): void {
    this.loading = true;

    this.subscriptionService.selectPlan({ planId: plan.id }).subscribe({
      next: (res) => {
        this.currentPlan = res.data;
        void this.notificationService.success(res.message);
        this.loading = false;
      },
      error: (err) => {
        void this.notificationService.error(getErrorMessage(err, 'Failed to select plan.'));
        this.loading = false;
      },
    });
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
