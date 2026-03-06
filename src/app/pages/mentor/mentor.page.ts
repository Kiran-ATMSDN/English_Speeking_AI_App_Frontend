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
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { MentorResponse } from '../../core/models/api.models';
import { MentorService } from '../../core/services/mentor.service';
import { SpeechService } from '../../core/services/speech.service';
import { getErrorMessage } from '../../core/utils/error.util';

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
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class MentorPage {
  loading = false;
  errorMessage = '';
  message = '';
  inputMessage = '';
  mentorResponse: MentorResponse | null = null;
  audioUrl = '';

  constructor(
    private readonly mentorService: MentorService,
    private readonly speechService: SpeechService,
    private readonly router: Router,
  ) {}

  send(): void {
    this.loading = true;
    this.errorMessage = '';
    this.message = '';
    this.audioUrl = '';

    this.mentorService.chat(this.inputMessage.trim()).subscribe({
      next: (res) => {
        this.mentorResponse = res.data;
        this.message = res.message;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = getErrorMessage(err, 'Failed to get mentor response.');
        this.loading = false;
      },
    });
  }

  speak(text: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.speechService.textToSpeech(text).subscribe({
      next: (res) => {
        this.audioUrl = res.data.audioUrl;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = getErrorMessage(err, 'Failed to generate speech.');
        this.loading = false;
      },
    });
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
