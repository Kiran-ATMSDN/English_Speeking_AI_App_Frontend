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
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SubscriptionPlan } from '../../core/models/api.models';
import { SubscriptionService } from '../../core/services/subscription.service';
import { getErrorMessage } from '../../core/utils/error.util';

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
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class SubscriptionsPage implements OnInit {
  plans: SubscriptionPlan[] = [];
  currentPlan: SubscriptionPlan | null = null;
  loading = false;
  message = '';
  errorMessage = '';

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = '';

    this.subscriptionService.getPlans().subscribe({
      next: (res) => {
        this.plans = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = getErrorMessage(err, 'Failed to load plans.');
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
    this.message = '';
    this.errorMessage = '';

    this.subscriptionService.selectPlan({ planId: plan.id }).subscribe({
      next: (res) => {
        this.currentPlan = res.data;
        this.message = res.message;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = getErrorMessage(err, 'Failed to select plan.');
        this.loading = false;
      },
    });
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
