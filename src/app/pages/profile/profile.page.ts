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
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { User } from '../../core/models/api.models';
import { ProfileService } from '../../core/services/profile.service';
import { getErrorMessage } from '../../core/utils/error.util';
import { NotificationService } from '../../core/services/notification.service';

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
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class ProfilePage implements OnInit {
  loading = false;
  user: User | null = null;
  fullName = '';
  email = '';
  learningPurpose = '';

  constructor(
    private readonly profileService: ProfileService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
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
        void this.notificationService.info('Profile loaded.');
        this.loading = false;
      },
      error: (err) => {
        void this.notificationService.error(getErrorMessage(err, 'Failed to fetch profile.'));
        this.loading = false;
      },
    });
  }

  save(): void {
    this.loading = true;

    this.profileService
      .updateMyProfile({
        fullName: this.fullName.trim(),
        email: this.email.trim(),
        learningPurpose: this.learningPurpose.trim(),
      })
      .subscribe({
        next: (res) => {
          this.user = res.data;
          void this.notificationService.success(res.message);
          this.loading = false;
        },
        error: (err) => {
          void this.notificationService.error(getErrorMessage(err, 'Failed to update profile.'));
          this.loading = false;
        },
      });
  }

  back(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
