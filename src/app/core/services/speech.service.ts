import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SpeechToTextPayload, TextToSpeechPayload } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  constructor(private readonly api: ApiService) {}

  speechToText(audioBase64: string, mimeType: string) {
    return this.api.post<SpeechToTextPayload>('/speech/speech-to-text', { audioBase64, mimeType });
  }

  textToSpeech(text: string) {
    return this.api.post<TextToSpeechPayload>('/speech/text-to-speech', { text });
  }
}
