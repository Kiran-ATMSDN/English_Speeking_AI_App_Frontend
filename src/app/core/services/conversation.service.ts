import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  ConversationMessage,
  ConversationSendPayload,
  ConversationStartPayload,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  constructor(private readonly api: ApiService) {}

  startSession() {
    return this.api.post<ConversationStartPayload>('/conversations/start', {});
  }

  sendMessage(sessionId: number, message: string) {
    return this.api.post<ConversationSendPayload>('/conversations/message', { sessionId, message });
  }

  getHistory(sessionId: number) {
    return this.api.get<ConversationMessage[]>(`/conversations/${sessionId}`);
  }
}
