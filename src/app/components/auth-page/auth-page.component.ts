import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-page',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="auth-shell">
      <div class="auth-card">
        <div class="auth-hero">
          <div class="brand-pill">
            <span class="brand-badge">DP</span>
            <div>
              <strong>Deal Part</strong>
              <small>Admin Portal</small>
            </div>
          </div>

          <div class="hero-copy">
            <p class="eyebrow">Secure Access</p>
            <h1>Welcome back to Deal Part</h1>
            <p>
              Sign in or verify your access to enter the modern admin dashboard experience.
            </p>
          </div>

          <div class="demo-box">
            <p class="demo-title">Demo</p>
            <div class="demo-row">
              <span>Signup and Login</span>
              <strong>Use any email/password</strong>
            </div>
          </div>
        </div>

        <div class="auth-form-panel">
          <div class="tab-switch mb-3">
            <button
              type="button"
              class="tab-btn"
              [class.active]="activeTab() === 'login'"
              (click)="setTab('login')"
            >
              Login
            </button>
            <button
              type="button"
              class="tab-btn"
              [class.active]="activeTab() === 'signup'"
              (click)="setTab('signup')"
            >
              Signup
            </button>
          </div>

          @if (feedback()) {
            <div class="alert" [class.alert-danger]="feedbackTone() === 'danger'" [class.alert-success]="feedbackTone() === 'success'">
              {{ feedback() }}
            </div>
          }

          @if (activeTab() === 'login') {
            <form [formGroup]="loginForm" (ngSubmit)="submitLogin()" novalidate>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input class="form-control form-control-lg" type="email" formControlName="email" />
              </div>

              <div class="mb-3">
                <label class="form-label">Password</label>
                <input class="form-control form-control-lg" type="password" formControlName="password" />
              </div>

              <button class="btn btn-success w-100 py-2 rounded-3 fw-semibold" type="submit">
                Login to Dashboard
              </button>
            </form>
          } @else {
            <form [formGroup]="signupForm" (ngSubmit)="submitSignup()" novalidate>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input class="form-control form-control-lg" type="email" formControlName="email" />
              </div>

              <div class="mb-3">
                <label class="form-label">Password</label>
                <input class="form-control form-control-lg" type="password" formControlName="password" />
              </div>

              <button class="btn btn-success w-100 py-2 rounded-3 fw-semibold" type="submit">
                Signup
              </button>
            </form>
          }

          <button type="button" class="btn btn-link demo-link px-0 mt-3" (click)="fillDemoCredentials()">
            Use demo credentials
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .auth-shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1rem;
      }

      .auth-card {
        width: min(1100px, 100%);
        display: grid;
        grid-template-columns: 1.05fr 0.95fr;
        background: #ffffff;
        border: 1px solid #e4eee7;
        border-radius: 28px;
        overflow: hidden;
        box-shadow: 0 28px 60px rgba(15, 23, 42, 0.1);
      }

      .auth-hero {
        padding: 2rem;
        background:
          radial-gradient(circle at top left, rgba(130, 214, 165, 0.45), transparent 35%),
          linear-gradient(135deg, #103524 0%, #1f7a51 100%);
        color: #fff;
        display: grid;
        gap: 1.5rem;
      }

      .brand-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        border-radius: 999px;
        padding: 0.45rem 0.75rem;
        width: fit-content;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .brand-pill strong,
      .hero-copy h1,
      .demo-box strong {
        display: block;
        color: #fff;
      }

      .brand-pill small,
      .hero-copy p,
      .demo-row span {
        color: rgba(255, 255, 255, 0.82);
      }

      .brand-badge {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: rgba(255, 255, 255, 0.18);
        font-weight: 800;
      }

      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.78rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .hero-copy h1 {
        font-size: clamp(1.8rem, 3vw, 2.4rem);
        margin-bottom: 0.6rem;
      }

      .demo-box {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 20px;
        padding: 1rem;
      }

      .demo-title {
        font-weight: 700;
        margin-bottom: 0.75rem;
      }

      .demo-row {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.35rem 0;
        flex-wrap: wrap;
      }

      .auth-form-panel {
        padding: 2rem;
        background: #fbfdfb;
      }

      .tab-switch {
        display: inline-flex;
        padding: 0.3rem;
        background: #edf6f0;
        border-radius: 999px;
      }

      .tab-btn {
        border: 0;
        background: transparent;
        color: #335745;
        padding: 0.65rem 1rem;
        border-radius: 999px;
        font-weight: 700;
      }

      .tab-btn.active {
        background: #ffffff;
        color: #1f7a51;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      }

      .form-label {
        color: #264433;
        font-weight: 600;
      }

      .form-control {
        border-color: #dbe9df;
        background: #fff;
      }

      .form-control:focus {
        border-color: #58b982;
        box-shadow: 0 0 0 0.2rem rgba(47, 158, 105, 0.15);
      }

      .demo-link {
        color: #1f7a51;
        font-weight: 700;
        text-decoration: none;
      }

      @media (max-width: 991.98px) {
        .auth-card {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 575.98px) {
        .auth-shell {
          padding: 0.4rem;
        }

        .auth-hero,
        .auth-form-panel {
          padding: 1.1rem;
        }

        .demo-row {
          flex-direction: column;
          gap: 0.2rem;
        }
      }
    `,
  ],
})
export class AuthPageComponent {
  protected readonly auth = inject(AuthService);

  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  protected readonly activeTab = signal<'login' | 'signup'>('login');
  protected readonly feedback = signal('');
  protected readonly feedbackTone = signal<'success' | 'danger'>('success');

  protected readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected readonly signupForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected setTab(tab: 'login' | 'signup'): void {
    this.activeTab.set(tab);
    this.feedback.set('');
  }

  protected fillDemoCredentials(): void {
    this.loginForm.patchValue({
      email: 'demo@example.com',
      password: 'password',
    });

    this.signupForm.patchValue({
      email: 'demo@example.com',
      password: 'password',
    });
  }

  protected submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const success = this.auth.login(
      this.loginForm.controls.email.getRawValue(),
      this.loginForm.controls.password.getRawValue()
    );

    this.feedbackTone.set(success ? 'success' : 'danger');
    this.feedback.set(success ? 'Login successful.' : 'Invalid email or password.');

    if (success) {
      void this.router.navigateByUrl('/dashboard');
    }
  }

  protected submitSignup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const result = this.auth.signup(
      this.signupForm.controls.email.getRawValue(),
      this.signupForm.controls.password.getRawValue()
    );

    this.feedbackTone.set(result.success ? 'success' : 'danger');
    this.feedback.set(result.message);

    if (result.success) {
      this.signupForm.reset();
    }
  }
}
