import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { MentorResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class MentorService {
  constructor(private readonly api: ApiService) {}

  chat(message: string) {
    return this.api.post<MentorResponse>('/ai/chat', { message });
  }
}
