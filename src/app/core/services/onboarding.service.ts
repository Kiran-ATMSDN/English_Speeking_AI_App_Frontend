import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { OnboardingAnswer, OnboardingQuestion } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  constructor(private readonly api: ApiService) {}

  getQuestions() {
    return this.api.get<OnboardingQuestion[]>('/onboarding/questions');
  }

  saveAnswer(payload: {
    questionKey: string;
    questionText: string;
    answerText: string;
  }) {
    return this.api.post<OnboardingAnswer>('/onboarding/answer', payload);
  }

  getMyAnswers() {
    return this.api.get<OnboardingAnswer[]>('/onboarding/answers');
  }
}
