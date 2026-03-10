import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
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

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.selectedFileName = file.name;
    this.loading = true;

    this.speechService.speechToText(file).subscribe({
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
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
