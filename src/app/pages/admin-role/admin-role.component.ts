import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

type SocialTone = 'google' | 'facebook' | 'twitter' | 'dribbble';
type PasswordField = 'current' | 'new' | 'confirm' | 'profile';

interface SocialItem {
  label: string;
  icon: string;
  tone: SocialTone;
}

@Component({
  selector: 'app-admin-role',
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-role.component.html',
  styleUrl: './admin-role.component.scss',
})
export class AdminRoleComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly avatarImage = 'assets/images/avater-large.png';
  protected readonly socialItems: SocialItem[] = [
    { label: 'Google', icon: 'bi bi-google', tone: 'google' },
    { label: 'Facebook', icon: 'bi bi-facebook', tone: 'facebook' },
    { label: 'X', icon: 'bi bi-twitter-x', tone: 'twitter' },
    { label: 'Dribbble', icon: 'bi bi-dribbble', tone: 'dribbble' },
  ];

  protected readonly profileForm = this.fb.group({
    firstName: ['Wade'],
    lastName: ['Warren'],
    profilePassword: ['••••••••'],
    phoneNumber: ['(+06) 555-0120'],
    email: ['wade.warren@example.com'],
    dateOfBirth: ['12-January-1999'],
    location: ['2972 Westheimer Rd. Santa Ana, Illinois 85486'],
    creditCard: ['834-4359-4444'],
    biography: [''],
    currentPassword: [''],
    newPassword: [''],
    confirmPassword: [''],
  });

  protected readonly showCurrentPassword = signal(false);
  protected readonly showNewPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);
  protected readonly showProfilePassword = signal(false);

  protected togglePassword(field: PasswordField): void {
    if (field === 'current') {
      this.showCurrentPassword.update((value) => !value);
      return;
    }

    if (field === 'new') {
      this.showNewPassword.update((value) => !value);
      return;
    }

    if (field === 'confirm') {
      this.showConfirmPassword.update((value) => !value);
      return;
    }

    this.showProfilePassword.update((value) => !value);
  }
}
