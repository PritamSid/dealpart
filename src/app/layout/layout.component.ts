import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-shell" [class.sidebar-open]="isSidebarOpen()">
      @if (isSidebarOpen()) {
        <button
          class="mobile-sidebar-backdrop d-lg-none"
          type="button"
          aria-label="Close sidebar"
          (click)="closeSidebar()"
        ></button>
      }

      <div
        class="mobile-sidebar d-lg-none"
        [class.open]="isSidebarOpen()"
        [class.collapsed]="isSidebarCollapsed()"
        [attr.aria-hidden]="!isSidebarOpen()"
        role="dialog"
        aria-label="Mobile navigation"
        (touchstart)="onSidebarTouchStart($event)"
        (touchend)="onSidebarTouchEnd($event)"
      >
        <app-sidebar
          [collapsible]="true"
          [collapsed]="isSidebarCollapsed()"
          [mobileOpen]="isSidebarOpen()"
          (toggleCollapsed)="toggleSidebarCollapse()"
          (requestClose)="closeSidebar()"
        ></app-sidebar>
      </div>

      <div class="shell-content">
        <div class="container-fluid py-3 py-lg-4 px-3 px-xxl-4">
          <div class="row g-4 align-items-start">
            <div
              class="col-12 d-none d-lg-block desktop-sidebar"
              [class.col-lg-1]="isSidebarCollapsed()"
              [class.col-lg-2]="!isSidebarCollapsed()"
            >
              <app-sidebar
                [collapsed]="isSidebarCollapsed()"
                (toggleCollapsed)="toggleSidebarCollapse()"
              ></app-sidebar>
            </div>

            <div
              class="col-12 main-content"
              [class.col-lg-11]="isSidebarCollapsed()"
              [class.col-lg-10]="!isSidebarCollapsed()"
            >
              <app-topbar
                [sidebarCollapsed]="isSidebarCollapsed()"
                [pageEyebrow]="pageHeader().eyebrow"
                [pageTitle]="pageHeader().title"
                [pageSubtitle]="pageHeader().subtitle"
                [userName]="currentUser()?.name || 'Pritam'"
                [userEmail]="currentUser()?.email || 'pritamcareershine@gmail.com'"
                (menuToggle)="toggleSidebar()"
                (profileSelected)="toggleProfileCard()"
                (logoutSelected)="logout()"
              ></app-topbar>

              @if (showProfileCard()) {
                <section class="profile-summary-card mb-3">
                  <div>
                    <p class="profile-kicker mb-1">Profile</p>
                    <h3 class="profile-title mb-1">{{ currentUser()?.name || 'Pritam' }}</h3>
                    <p class="profile-meta mb-0">
                      {{ currentUser()?.email }} · {{ currentUser()?.role }}
                    </p>
                  </div>
                  <button
                    class="btn btn-outline-success rounded-pill"
                    type="button"
                    (click)="toggleProfileCard()"
                  >
                    Close
                  </button>
                </section>
              }

              <router-outlet></router-outlet>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      .dashboard-shell {
        min-height: 100vh;
        position: relative;
        isolation: isolate;
        overflow-x: hidden;
      }

      .shell-content {
        position: relative;
        z-index: 1;
        transform-origin: top center;
        transition:
          transform 0.3s ease,
          filter 0.3s ease,
          opacity 0.3s ease;
      }

      .desktop-sidebar {
        position: sticky;
        top: 1rem;
        transition: width 0.3s ease;
      }

      .main-content {
        min-width: 0;
        transition:
          transform 0.3s ease,
          filter 0.3s ease;
      }

      .profile-summary-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        background: #ffffff;
        border: 1px solid #e5efe8;
        border-radius: 24px;
        padding: 1rem 1.15rem;
        box-shadow: 0 18px 35px rgba(15, 23, 42, 0.06);
      }

      .profile-kicker {
        color: #6f8479;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 700;
      }

      .profile-title {
        color: #183b2b;
        font-weight: 800;
      }

      .profile-meta {
        color: #6f8479;
      }

      .mobile-sidebar-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
        padding: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        z-index: 1040;
      }

      .mobile-sidebar {
        position: fixed;
        top: 0.75rem;
        left: 0.75rem;
        bottom: 0.75rem;
        width: min(86vw, 340px);
        padding: 0;
        overflow: hidden;
        z-index: 1045;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        touch-action: pan-y;
        will-change: transform;
        transform: translateX(-100%);
        transition: all 0.3s ease;
      }

      .mobile-sidebar.open {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateX(0);
      }

      .mobile-sidebar.collapsed {
        width: 104px;
      }

      .mobile-sidebar app-sidebar {
        display: block;
        height: 100%;
      }

      .mobile-sidebar :is(.sidebar-card) {
        min-height: 100%;
        border-radius: 24px;
        box-shadow: 0 24px 50px rgba(15, 23, 42, 0.22);
      }

      @media (max-width: 991.98px) {
        .dashboard-shell .container-fluid {
          padding-left: 0.85rem !important;
          padding-right: 0.85rem !important;
        }

        .dashboard-shell.sidebar-open .shell-content {
          transform: scale(0.982) translateX(4px);
          filter: blur(1.5px);
        }
      }

      @media (max-width: 767.98px) {
        .dashboard-shell .container-fluid {
          padding-left: 0.35rem !important;
          padding-right: 0.35rem !important;
        }

        .dashboard-shell .row {
          --bs-gutter-x: 0.75rem;
          --bs-gutter-y: 0.75rem;
        }

        .mobile-sidebar {
          top: 0.5rem;
          left: 0.5rem;
          bottom: 0.5rem;
          width: min(92vw, 340px);
        }

        .mobile-sidebar.collapsed {
          width: 88px;
        }
      }

      @media (max-width: 575.98px) {
        .dashboard-shell .container-fluid {
          padding-left: 0.2rem !important;
          padding-right: 0.2rem !important;
        }

        .profile-summary-card {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `,
  ],
})
export class LayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private touchStartX = 0;
  private touchStartY = 0;

  protected readonly currentUser = signal(this.authService.getCurrentUser());
  protected readonly isSidebarOpen = signal(false);
  protected readonly isSidebarCollapsed = signal(false);
  protected readonly showProfileCard = signal(false);
  protected readonly pageHeader = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.resolvePageHeader(this.router.routerState.snapshot.root))
    ),
    {
      initialValue: this.resolvePageHeader(this.router.routerState.snapshot.root),
    }
  );

  protected openSidebar(): void {
    this.isSidebarOpen.set(true);
  }

  protected toggleSidebar(): void {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 992;

    if (isDesktop) {
      this.toggleSidebarCollapse();
      return;
    }

    if (this.isSidebarOpen()) {
      this.closeSidebar();
      return;
    }

    this.openSidebar();
  }

  protected toggleSidebarCollapse(): void {
    this.isSidebarCollapsed.update((value) => !value);
  }

  protected onSidebarTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  protected onSidebarTouchEnd(event: TouchEvent): void {
    const touch = event.changedTouches[0];

    if (!touch || !this.isSidebarOpen()) {
      return;
    }

    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = Math.abs(touch.clientY - this.touchStartY);

    if (deltaX < -70 && deltaY < 80) {
      this.closeSidebar();
    }
  }

  protected toggleProfileCard(): void {
    this.showProfileCard.update((value) => !value);
  }

  protected logout(): void {
    this.authService.logout();
    this.showProfileCard.set(false);
    this.isSidebarOpen.set(false);
    void this.router.navigateByUrl('/login');
  }

  protected closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  private resolvePageHeader(route: ActivatedRouteSnapshot): {
    eyebrow: string;
    title: string;
    subtitle: string;
  } {
    let current = route;

    while (current.firstChild) {
      current = current.firstChild;
    }

    return {
      eyebrow: (current.data['eyebrow'] as string | undefined) ?? 'Welcome back',
      title: (current.data['title'] as string | undefined) ?? 'Dashboard Overview',
      subtitle:
        (current.data['subtitle'] as string | undefined) ??
        'Monitor sales, products, and customer performance in one place.',
    };
  }
}
