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
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { MentorResponse } from '../../core/models/api.models';
import { MentorService } from '../../core/services/mentor.service';
import { SpeechService } from '../../core/services/speech.service';
import { getErrorMessage } from '../../core/utils/error.util';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-mentor',
  templateUrl: './mentor.page.html',
  styleUrls: ['./mentor.page.scss'],
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
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class MentorPage {
  loading = false;
  inputMessage = '';
  mentorResponse: MentorResponse | null = null;
  audioUrl = '';

  constructor(
    private readonly mentorService: MentorService,
    private readonly speechService: SpeechService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {}

  send(): void {
    this.loading = true;
    this.audioUrl = '';

    this.mentorService.chat(this.inputMessage.trim()).subscribe({
      next: (res) => {
        this.mentorResponse = res.data;
        void this.notificationService.success(res.message);
        this.loading = false;
      },
      error: (err) => {
        void this.notificationService.error(getErrorMessage(err, 'Failed to get mentor response.'));
        this.loading = false;
      },
    });
  }

  speak(text: string): void {
    this.loading = true;

    this.speechService.textToSpeech(text).subscribe({
      next: (res) => {
        this.audioUrl = res.data.audioUrl;
        void this.notificationService.info('Speech generated successfully.');
        this.loading = false;
      },
      error: (err) => {
        void this.notificationService.error(getErrorMessage(err, 'Failed to generate speech.'));
        this.loading = false;
      },
    });
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
