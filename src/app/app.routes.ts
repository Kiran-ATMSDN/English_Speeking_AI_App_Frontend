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
