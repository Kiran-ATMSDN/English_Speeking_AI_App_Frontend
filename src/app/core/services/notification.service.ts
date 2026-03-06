import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private readonly toastController: ToastController) {}

  async success(message: string): Promise<void> {
    await this.present(message, 'success');
  }

  async error(message: string): Promise<void> {
    await this.present(message, 'danger');
  }

  async info(message: string): Promise<void> {
    await this.present(message, 'primary');
  }

  private async present(message: string, color: 'success' | 'danger' | 'primary'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2600,
      position: 'top',
      buttons: [{ text: 'OK', role: 'cancel' }],
    });

    await toast.present();
  }
}
