import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { SpeechService } from '../../core/services/speech.service';
import { getErrorMessage } from '../../core/utils/error.util';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.page.html',
  styleUrls: ['./speech.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
export class SpeechPage {
  loading = false;
  transcribedText = '';
  selectedFileName = '';

  constructor(
    private readonly speechService: SpeechService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {}

  async onAudioSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.selectedFileName = file.name;
    this.loading = true;

    try {
      const base64 = await this.fileToBase64(file);
      const cleanBase64 = base64.split(',')[1] || '';

      this.speechService.speechToText(cleanBase64, file.type || 'audio/mpeg').subscribe({
        next: (res) => {
          this.transcribedText = res.data.text;
          void this.notificationService.success(res.message);
          this.loading = false;
        },
        error: (err) => {
          void this.notificationService.error(getErrorMessage(err, 'Failed to transcribe speech.'));
          this.loading = false;
        },
      });
    } catch {
      void this.notificationService.error('Failed to read selected audio file.');
      this.loading = false;
    }
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
