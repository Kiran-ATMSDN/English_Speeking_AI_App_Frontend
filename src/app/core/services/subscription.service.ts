import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SubscriptionPlan } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  constructor(private readonly api: ApiService) {}

  getPlans() {
    return this.api.get<SubscriptionPlan[]>('/subscriptions/plans');
  }

  getCurrent() {
    return this.api.get<SubscriptionPlan | null>('/subscriptions/current');
  }

  selectPlan(payload: { planId?: number; planName?: string }) {
    return this.api.post<SubscriptionPlan>('/subscriptions/select', payload);
  }
}
