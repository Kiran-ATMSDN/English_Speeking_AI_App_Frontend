import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'onboarding',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/onboarding/onboarding.page').then((m) => m.OnboardingPage),
  },
  {
    path: 'subscriptions',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/subscriptions/subscriptions.page').then((m) => m.SubscriptionsPage),
  },
  {
    path: 'mentor',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/mentor/mentor.page').then((m) => m.MentorPage),
  },
  {
    path: 'conversation',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/conversation/conversation.page').then((m) => m.ConversationPage),
  },
  {
    path: 'speech',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/speech/speech.page').then((m) => m.SpeechPage),
  },
  {
    path: 'daily-vocabulary',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/daily-vocabulary/daily-vocabulary.page').then((m) => m.DailyVocabularyPage),
  },
  {
    path: 'grammar-lessons',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/grammar-lessons/grammar-lessons.page').then((m) => m.GrammarLessonsPage),
  },
  {
    path: 'common-sentences',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/common-sentences/common-sentences.page').then((m) => m.CommonSentencesPage),
  },
  {
    path: 'conversation-scripts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/conversation-scripts/conversation-scripts.page').then((m) => m.ConversationScriptsPage),
  },
  {
    path: 'pronunciation-tips',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/pronunciation-tips/pronunciation-tips.page').then((m) => m.PronunciationTipsPage),
  },
  {
    path: 'english-learning-tips',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/english-learning-tips/english-learning-tips.page').then((m) => m.EnglishLearningTipsPage),
  },
  {
    path: 'mini-quizzes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/mini-quizzes/mini-quizzes.page').then((m) => m.MiniQuizzesPage),
  },
  {
    path: 'english-idioms',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/english-idioms/english-idioms.page').then((m) => m.EnglishIdiomsPage),
  },
  {
    path: 'word-of-the-day',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/word-of-the-day/word-of-the-day.page').then((m) => m.WordOfTheDayPage),
  },
  {
    path: 'motivational-messages',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/motivational-messages/motivational-messages.page').then((m) => m.MotivationalMessagesPage),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
