import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { GrammarLesson } from '../../core/models/api.models';
import { CoachAction, CoachAvatarComponent, CoachMood } from '../../core/components/coach-avatar/coach-avatar.component';
import { OnboardingService } from '../../core/services/onboarding.service';
import { NotificationService } from '../../core/services/notification.service';
import { pickFemaleEnglishVoice } from '../../core/utils/speech-voice.util';
import { getErrorMessage } from '../../core/utils/error.util';

type DifficultyLevel = 'Simple' | 'Intermediate' | 'Advanced';

@Component({
  selector: 'app-grammar-lessons',
  templateUrl: './grammar-lessons.page.html',
  styleUrls: ['./grammar-lessons.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CoachAvatarComponent,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
  ],
})
export class GrammarLessonsPage implements OnInit {
  dayNumber = 1;
  currentDay = 1;
  totalDays = 1;
  level: DifficultyLevel = 'Simple';
  loading = false;
  speakingLesson = false;
  lesson: GrammarLesson = {
    title: '',
    explanation: '',
    formula: '',
    examples: [],
  };
  avatarActions: CoachAction[] = [
    { id: 'lesson', label: 'Read Lesson' },
    { id: 'examples', label: 'Read Examples' },
    { id: 'options', label: 'Read Options' },
  ];

  constructor(
    private readonly router: Router,
    private readonly onboardingService: OnboardingService,
    private readonly notificationService: NotificationService,
  ) {}

  get coachMood(): CoachMood {
    if (this.speakingLesson) {
      return 'speaking';
    }

    if (this.loading) {
      return 'thinking';
    }

    return 'cheerful';
  }

  get coachTip(): string {
    if (this.speakingLesson) {
      return 'I am reading the full lesson aloud. Follow the rhythm and repeat the examples after me.';
    }

    if (this.loading) {
      return 'I am preparing your next grammar drill with examples you can replay.';
    }

    return `Tap my avatar to hear this lesson and the available voice options. We are on day ${this.dayNumber} of ${this.totalDays}.`;
  }

  ngOnInit(): void {
    // Data load is handled in ionViewWillEnter.
  }

  ionViewWillEnter(): void {
    this.currentDay = 1;
    this.fetchLesson(1);
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }

  previousDay(): void {
    if (this.currentDay <= 1 || this.loading) {
      return;
    }
    this.fetchLesson(this.currentDay - 1);
  }

  nextDay(): void {
    if (this.currentDay >= this.totalDays || this.loading) {
      return;
    }
    this.fetchLesson(this.currentDay + 1);
  }

  goToDayOne(): void {
    if (this.loading) {
      return;
    }
    this.currentDay = 1;
    this.fetchLesson(1);
  }

  onAvatarTap(): void {
    if (!this.lesson.title) {
      return;
    }

    const intro = `Hello, I am Coach Mira. Today we are learning ${this.lesson.title}. ${this.lesson.explanation}. `;
    const options = 'Avatar options are: Read Lesson, Read Examples, and Read Options.';
    this.speakText(`${intro}${options}`);
  }

  onAvatarAction(actionId: string): void {
    if (actionId === 'lesson') {
      this.speakLesson();
      return;
    }

    if (actionId === 'examples') {
      this.readAllExamples();
      return;
    }

    this.speakText('You can use Play Lesson, Stop, Previous day, Day 1, and Next. You can also tap Read Lesson or Read Examples on my card.');
  }

  speakLesson(): void {
    if (!this.lesson.title) {
      return;
    }

    const examplesText = (this.lesson.examples || [])
      .map((x, i) => `Example ${i + 1}. ${x}`)
      .join(' ');
    const speechText = `Lesson title. ${this.lesson.title}. Explanation. ${this.lesson.explanation}. Formula. ${
      this.lesson.formula || 'Not available'
    }. ${examplesText}`;

    this.speakText(speechText);
  }

  speakExample(example: string): void {
    const text = String(example || '').trim();
    if (!text) {
      return;
    }

    this.speakText(text, false);
  }

  stopSpeaking(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    this.speakingLesson = false;
  }

  private readAllExamples(): void {
    const text = (this.lesson.examples || []).map((example, index) => `Example ${index + 1}. ${example}`).join(' ');
    if (!text) {
      return;
    }
    this.speakText(text);
  }

  private speakText(text: string, trackSpeaking = true): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      void this.notificationService.error('Text-to-speech is not supported on this device/browser.');
      return;
    }

    const speechText = String(text || '').trim();
    if (!speechText) {
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.08;

    const selectedVoice = pickFemaleEnglishVoice(synth.getVoices());
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || utterance.lang;
    }

    if (trackSpeaking) {
      utterance.onstart = () => {
        this.speakingLesson = true;
      };
      utterance.onend = () => {
        this.speakingLesson = false;
      };
      utterance.onerror = () => {
        this.speakingLesson = false;
      };
    }

    synth.cancel();
    synth.speak(utterance);
  }

  private fetchLesson(day?: number): void {
    const requestedDay = day ?? 1;
    this.loading = true;
    this.onboardingService.getGrammarLessons(requestedDay).subscribe({
      next: (res) => {
        this.dayNumber = res.data.dayNumber;
        this.currentDay = res.data.dayNumber;
        this.totalDays = res.data.totalDays;
        this.level = res.data.level;
        this.lesson = res.data.lesson;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        void this.notificationService.error(
          getErrorMessage(error, 'Failed to load grammar lesson.'),
        );
      },
    });
  }
}
