import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private readonly api: ApiService) {}

  getMyProfile() {
    return this.api.get<User>('/users/me');
  }

  updateMyProfile(payload: {
    fullName?: string;
    email?: string;
    learningPurpose?: string;
  }) {
    return this.api.put<User>('/users/me', payload);
  }
}
