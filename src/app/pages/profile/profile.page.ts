import { Component, OnInit } from '@angular/core';
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
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { User } from '../../core/models/api.models';
import { ProfileService } from '../../core/services/profile.service';
import { getErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
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
    IonInput,
    IonItem,
    IonLabel,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class ProfilePage implements OnInit {
  loading = false;
  message = '';
  errorMessage = '';
  user: User | null = null;
  fullName = '';
  email = '';
  learningPurpose = '';

  constructor(
    private readonly profileService: ProfileService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.loading = true;
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        this.user = res.data;
        this.fullName = res.data.fullName || '';
        this.email = res.data.email || '';
        this.learningPurpose = res.data.learningPurpose || '';
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = getErrorMessage(err, 'Failed to fetch profile.');
        this.loading = false;
      },
    });
  }

  save(): void {
    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    this.profileService
      .updateMyProfile({
        fullName: this.fullName.trim(),
        email: this.email.trim(),
        learningPurpose: this.learningPurpose.trim(),
      })
      .subscribe({
        next: (res) => {
          this.user = res.data;
          this.message = res.message;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = getErrorMessage(err, 'Failed to update profile.');
          this.loading = false;
        },
      });
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
