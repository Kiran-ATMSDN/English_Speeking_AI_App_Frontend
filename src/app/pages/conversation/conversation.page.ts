import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ConversationMessage } from '../../core/models/api.models';
import { CoachAction, CoachAvatarComponent, CoachMood } from '../../core/components/coach-avatar/coach-avatar.component';
import { ConversationService } from '../../core/services/conversation.service';
import { SpeechService } from '../../core/services/speech.service';
import { getErrorMessage } from '../../core/utils/error.util';
import { NotificationService } from '../../core/services/notification.service';
import { pickFemaleEnglishVoice } from '../../core/utils/speech-voice.util';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CoachAvatarComponent,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class ConversationPage {
  loading = false;
  sessionId: number | null = null;
  inputMessage = '';
  history: ConversationMessage[] = [];
  transcribedText = '';
  avatarActions: CoachAction[] = [
    { id: 'intro', label: 'Read Intro' },
    { id: 'reply', label: 'Read Last Reply' },
    { id: 'options', label: 'Read Options' },
  ];

  constructor(
    private readonly conversationService: ConversationService,
    private readonly speechService: SpeechService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {}

  get coachMood(): CoachMood {
    if (this.loading) {
      return 'thinking';
    }

    if (this.history.length) {
      return 'listening';
    }

    if (this.sessionId) {
      return 'cheerful';
    }

    return 'speaking';
  }

  get coachTip(): string {
    if (this.loading) {
      return 'I am processing your session so the next practice turn feels quick and natural.';
    }

    if (!this.sessionId) {
      return 'Tap me to hear how this conversation practice works, then start a session.';
    }

    if (this.transcribedText) {
      return 'Your audio is ready as text. Read it once, then send it as a natural reply.';
    }

    if (this.history.length) {
      return 'Tap my avatar and I can read the latest reply or explain the speaking options again.';
    }

    return 'Your session is live. Type or upload audio to begin.';
  }

  onAvatarTap(): void {
    const status = this.sessionId ? `Your session number is ${this.sessionId}.` : 'Your session has not started yet.';
    const reply = this.getLatestAssistantMessage();
    const replyText = reply ? `Latest coach reply: ${reply}.` : 'There is no coach reply yet.';
    this.speakText(`${status} ${replyText} Avatar options are: Read Intro, Read Last Reply, and Read Options.`);
  }

  onAvatarAction(actionId: string): void {
    if (actionId === 'intro') {
      this.speakText('This is your speaking practice room. Start a session, type a message or upload audio, then continue the conversation step by step.');
      return;
    }

    if (actionId === 'reply') {
      const reply = this.getLatestAssistantMessage();
      this.speakText(reply ? `Latest coach reply. ${reply}` : 'There is no coach reply yet. Start a session and send a message first.');
      return;
    }

    this.speakText('You can Start Session, open History, upload audio, type a message, and send the message. You can also use my avatar buttons to hear the intro or the latest reply.');
  }

  startSession(): void {
    this.loading = true;

    this.conversationService.startSession().subscribe({
      next: (res) => {
        this.sessionId = res.data.sessionId;
        this.history = [];
        void this.notificationService.success(res.message);
        this.loading = false;
      },
      error: (err) => {
        void this.notificationService.error(getErrorMessage(err, 'Failed to start session.'));
        this.loading = false;
      },
    });
  }

  sendMessage(): void {
    if (!this.sessionId) {
      void this.notificationService.info('Start a conversation session first.');
      return;
    }

    const text = this.inputMessage.trim();
    if (!text) {
      return;
    }

    this.loading = true;

    this.conversationService.sendMessage(this.sessionId, text).subscribe({
      next: (res) => {
        this.inputMessage = '';
        this.history.push(
          { role: 'user', message: text },
          { role: 'assistant', message: res.data.assistantMessage },
        );
        void this.notificationService.success(res.message);
        this.loading = false;
      },
      error: (err) => {
        void this.notificationService.error(getErrorMessage(err, 'Failed to send message.'));
        this.loading = false;
      },
    });
  }

  loadHistory(): void {
    if (!this.sessionId) {
      return;
    }

    this.loading = true;
    this.conversationService.getHistory(this.sessionId).subscribe({
      next: (res) => {
        this.history = res.data;
        void this.notificationService.info('Conversation history loaded.');
        this.loading = false;
      },
      error: (err) => {
        void this.notificationService.error(getErrorMessage(err, 'Failed to fetch history.'));
        this.loading = false;
      },
    });
  }

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.loading = true;
    this.speechService.speechToText(file).subscribe({
      next: (res) => {
        this.transcribedText = res.data.text;
        this.inputMessage = res.data.text;
        void this.notificationService.success('Audio transcribed successfully.');
        this.loading = false;
      },
      error: (err) => {
        void this.notificationService.error(getErrorMessage(err, 'Failed to transcribe audio.'));
        this.loading = false;
      },
    });
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }

  private getLatestAssistantMessage(): string {
    const assistantMessage = [...this.history].reverse().find((item) => item.role === 'assistant');
    return assistantMessage?.message || '';
  }

  private speakText(text: string): void {
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

    synth.cancel();
    synth.speak(utterance);
  }
}
