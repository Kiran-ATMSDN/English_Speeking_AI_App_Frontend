import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  DailyVocabularyPayload,
  GrammarLessonPayload,
  CommonSentencesPayload,
  ConversationScriptPayload,
  PronunciationTipsPayload,
  EnglishLearningTipsPayload,
  MiniQuizPayload,
  EnglishIdiomsPayload,
  WordOfTheDayPayload,
  MotivationalMessagesPayload,
  OnboardingAnswer,
  OnboardingQuestion,
} from '../models/api.models';

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

  getDailyVocabulary(day?: number) {
    const path = day ? `/onboarding/daily-vocabulary?day=${day}` : '/onboarding/daily-vocabulary';
    return this.api.get<DailyVocabularyPayload>(path);
  }

  getGrammarLessons(day?: number) {
    const path = day ? `/onboarding/grammar-lessons?day=${day}` : '/onboarding/grammar-lessons';
    return this.api.get<GrammarLessonPayload>(path);
  }

  getCommonSentences(day?: number) {
    const path = day ? `/onboarding/common-sentences?day=${day}` : '/onboarding/common-sentences';
    return this.api.get<CommonSentencesPayload>(path);
  }

  getConversationScripts(day?: number) {
    const path = day ? `/onboarding/conversation-scripts?day=${day}` : '/onboarding/conversation-scripts';
    return this.api.get<ConversationScriptPayload>(path);
  }

  getPronunciationTips(day?: number) {
    const path = day ? `/onboarding/pronunciation-tips?day=${day}` : '/onboarding/pronunciation-tips';
    return this.api.get<PronunciationTipsPayload>(path);
  }

  getEnglishLearningTips(day?: number) {
    const path = day ? `/onboarding/english-learning-tips?day=${day}` : '/onboarding/english-learning-tips';
    return this.api.get<EnglishLearningTipsPayload>(path);
  }

  getMiniQuiz(day?: number) {
    const path = day ? `/onboarding/mini-quizzes?day=${day}` : '/onboarding/mini-quizzes';
    return this.api.get<MiniQuizPayload>(path);
  }

  getEnglishIdioms(day?: number) {
    const path = day ? `/onboarding/english-idioms?day=${day}` : '/onboarding/english-idioms';
    return this.api.get<EnglishIdiomsPayload>(path);
  }

  getWordOfTheDay(day?: number) {
    const path = day ? `/onboarding/word-of-the-day?day=${day}` : '/onboarding/word-of-the-day';
    return this.api.get<WordOfTheDayPayload>(path);
  }

  getMotivationalMessages(day?: number) {
    const path = day ? `/onboarding/motivational-messages?day=${day}` : '/onboarding/motivational-messages';
    return this.api.get<MotivationalMessagesPayload>(path);
  }
}
