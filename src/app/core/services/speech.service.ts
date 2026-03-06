import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { ApiResponse, SpeechToTextPayload, TextToSpeechPayload } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(
    private readonly api: ApiService,
    private readonly http: HttpClient,
  ) {}

  speechToText(file: File) {
    const mimeType = file.type || 'application/octet-stream';
    return this.http.post<ApiResponse<SpeechToTextPayload>>(`${this.baseUrl}/speech/speech-to-text`, file, {
      headers: new HttpHeaders({
        'Content-Type': mimeType,
      }),
    });
  }

  textToSpeech(text: string) {
    return this.api.post<TextToSpeechPayload>('/speech/text-to-speech', { text });
  }
}
