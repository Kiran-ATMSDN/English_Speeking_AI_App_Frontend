import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ConversationMessage } from '../../core/models/api.models';
import { ConversationService } from '../../core/services/conversation.service';
import { SpeechService } from '../../core/services/speech.service';
import { getErrorMessage } from '../../core/utils/error.util';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonText,
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

  constructor(
    private readonly conversationService: ConversationService,
    private readonly speechService: SpeechService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {}

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

  async onAudioSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const base64 = await this.fileToBase64(file);
    const cleanBase64 = base64.split(',')[1] || '';

    this.loading = true;
    this.speechService.speechToText(cleanBase64, file.type || 'audio/mpeg').subscribe({
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

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
}
