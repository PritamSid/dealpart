import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'closeMenus()',
  },
  template: `
    <header class="topbar-card mb-4">
      <div class="title-wrap">
        <button
          class="menu-btn d-lg-none"
          type="button"
          aria-label="Toggle sidebar"
          (click)="openMenu($event)"
        >
          <i class="bi bi-list"></i>
        </button>

        <div>
          <p class="eyebrow mb-1">{{ pageEyebrow() }}</p>
          <h2 class="page-title mb-1">{{ pageTitle() }}</h2>
          <p class="page-subtitle mb-0">{{ pageSubtitle() }}</p>
        </div>
      </div>

      <div class="toolbar">
        <!-- <button
          class="icon-btn d-none d-xl-inline-flex"
          type="button"
          [attr.aria-label]="sidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          (click)="openMenu($event)"
        >
          <i
            class="bi"
            [class.bi-layout-sidebar-inset-reverse]="sidebarCollapsed()"
            [class.bi-layout-sidebar-inset]="!sidebarCollapsed()"
          ></i>
        </button> -->

        <div class="search-box">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="Search data, users, or reports" />
        </div>

        <button
          class="icon-btn theme-toggle"
          type="button"
          [class.active]="isDarkMode()"
          [attr.aria-label]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
          (click)="toggleTheme($event)"
        >
          <i
            class="bi"
            [class.bi-sun-fill]="isDarkMode()"
            [class.bi-moon-stars-fill]="!isDarkMode()"
          ></i>
        </button>

        <div class="notifications-wrap">
          <button
            class="icon-btn has-indicator"
            type="button"
            aria-label="Open notifications"
            (click)="toggleNotifications($event)"
          >
            <i class="bi bi-bell"></i>
            <span class="icon-badge">{{ unreadNotifications() }}</span>
          </button>

          @if (notificationsOpen()) {
            <div class="notifications-menu" (click)="$event.stopPropagation()">
              <div class="notifications-header">
                <div>
                  <strong>Notifications</strong>
                  <small>{{ unreadNotifications() }} new updates</small>
                </div>
                <span class="notifications-pill">Demo</span>
              </div>

              <div class="notifications-list">
                @for (notification of notifications; track notification.id) {
                  <button class="notification-item" type="button">
                    <span
                      class="notification-icon"
                      [class.success]="notification.tone === 'success'"
                      [class.warning]="notification.tone === 'warning'"
                      [class.info]="notification.tone === 'info'"
                    >
                      <i [class]="'bi ' + notification.icon"></i>
                    </span>

                    <span class="notification-copy">
                      <span class="notification-title">{{ notification.title }}</span>
                      <span class="notification-message">{{ notification.message }}</span>
                      <span class="notification-time">{{ notification.time }}</span>
                    </span>
                  </button>
                }
              </div>
            </div>
          }
        </div>

        <div class="settings-wrap">
          <button
            class="icon-btn"
            type="button"
            aria-label="Open settings menu"
            (click)="toggleSettings($event)"
          >
            <i class="bi bi-gear"></i>
          </button>

          @if (settingsOpen()) {
            <div class="settings-menu" (click)="$event.stopPropagation()">
              <div class="settings-user">
                <strong>{{ userName() }}</strong>
                <small>{{ userEmail() }}</small>
              </div>

              <button class="settings-item" type="button" (click)="showProfile($event)">
                <i class="bi bi-person-circle"></i>
                <span>Profile</span>
              </button>
              <button class="settings-item logout" type="button" (click)="logout($event)">
                <i class="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>
            </div>
          }
        </div>

        <div class="profile-pill">
          <div class="avatar">{{ userInitials() }}</div>
          <div>
            <p class="mb-0 fw-semibold">{{ userName() }}</p>
            <small>Dashboard Admin</small>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .topbar-card {
        background: #ffffff;
        border: 1px solid #e5efe8;
        border-radius: 24px;
        padding: 1rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.06);
      }

      .title-wrap {
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }

      .menu-btn {
        width: 42px;
        height: 42px;
        border: 1px solid #dbe9df;
        border-radius: 12px;
        background: #f8fcf9;
        color: #2a5e42;
      }

      .eyebrow {
        color: #6d8779;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.72rem;
        font-weight: 700;
      }

      .page-title {
        color: #183b2b;
        font-size: clamp(1.2rem, 2vw, 1.6rem);
        font-weight: 800;
      }

      .page-subtitle {
        color: #6f8479;
        max-width: 560px;
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: flex-end;
        flex: 1;
      }

      .search-box {
        flex: 1 1 280px;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 0.65rem;
        border: 1px solid #dbe9df;
        border-radius: 14px;
        padding: 0.7rem 0.9rem;
        background: #f8fcf9;
      }

      .search-box i,
      .icon-btn i,
      .settings-item i {
        color: #668173;
      }

      .search-box input {
        border: 0;
        background: transparent;
        outline: none;
        width: 100%;
        color: #284738;
      }

      .icon-btn {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        border: 1px solid var(--dp-border, #dbe9df);
        background: var(--dp-surface-soft, #f8fcf9);
      }

      .theme-toggle.active {
        background: linear-gradient(135deg, rgba(47, 158, 105, 0.18), rgba(253, 193, 7, 0.22));
        border-color: rgba(47, 158, 105, 0.4);
      }

      .theme-toggle.active i {
        color: #f5b301;
      }

      .notifications-wrap,
      .settings-wrap {
        position: relative;
      }

      .icon-btn.has-indicator {
        position: relative;
        overflow: visible;
      }

      .icon-badge {
        position: absolute;
        top: -0.35rem;
        right: -0.35rem;
        min-width: 1.15rem;
        height: 1.15rem;
        border-radius: 999px;
        display: grid;
        place-items: center;
        padding: 0 0.2rem;
        background: #2f9e69;
        color: #ffffff;
        font-size: 0.66rem;
        font-weight: 700;
        box-shadow: 0 8px 18px rgba(47, 158, 105, 0.28);
      }

      .notifications-menu,
      .settings-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        border-radius: 18px;
        background: #ffffff;
        border: 1px solid #e4eee7;
        box-shadow: 0 18px 35px rgba(15, 23, 42, 0.1);
        z-index: 20;
      }

      .notifications-menu {
        width: min(320px, calc(100vw - 2rem));
        padding: 0.6rem;
      }

      .settings-menu {
        min-width: 220px;
        padding: 0.55rem;
      }

      .notifications-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.2rem 0.35rem 0.7rem;
        border-bottom: 1px solid #eef4ef;
        margin-bottom: 0.35rem;
      }

      .notifications-header strong {
        display: block;
        color: #173a2a;
      }

      .notifications-header small {
        color: #73877d;
      }

      .notifications-pill {
        display: inline-flex;
        align-items: center;
        padding: 0.18rem 0.5rem;
        border-radius: 999px;
        background: #eef9f2;
        color: #2f9e69;
        font-size: 0.7rem;
        font-weight: 700;
      }

      .notifications-list {
        display: grid;
        gap: 0.35rem;
      }

      .notification-item {
        width: 100%;
        border: 0;
        background: transparent;
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.65rem 0.45rem;
        border-radius: 14px;
        text-align: left;
      }

      .notification-item:hover {
        background: #f4faf6;
      }

      .notification-icon {
        width: 2.15rem;
        height: 2.15rem;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: #eef6f1;
        color: #2a5e42;
        flex-shrink: 0;
      }

      .notification-icon.success {
        background: #eaf8f0;
        color: #23915d;
      }

      .notification-icon.warning {
        background: #fff5e8;
        color: #d98b1f;
      }

      .notification-icon.info {
        background: #edf5ff;
        color: #2f7de1;
      }

      .notification-copy {
        min-width: 0;
        display: grid;
        gap: 0.15rem;
      }

      .notification-title {
        color: #183b2b;
        font-size: 0.92rem;
        font-weight: 700;
      }

      .notification-message {
        color: #6f8479;
        font-size: 0.8rem;
      }

      .notification-time {
        color: #8ca093;
        font-size: 0.75rem;
      }

      .settings-user {
        padding: 0.45rem 0.55rem 0.7rem;
        border-bottom: 1px solid #eef4ef;
        margin-bottom: 0.35rem;
      }

      .settings-user strong {
        display: block;
        color: #173a2a;
      }

      .settings-user small {
        color: #73877d;
        word-break: break-word;
      }

      .settings-item {
        width: 100%;
        border: 0;
        background: transparent;
        display: flex;
        align-items: center;
        gap: 0.7rem;
        padding: 0.7rem 0.55rem;
        border-radius: 12px;
        color: #284738;
      }

      .settings-item:hover {
        background: #f4faf6;
      }

      .settings-item.logout {
        color: #c34055;
      }

      .settings-item.logout i {
        color: #c34055;
      }

      .profile-pill {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        border-radius: 14px;
        padding: 0.35rem 0.45rem;
        background: #f8fcf9;
        border: 1px solid #dbe9df;
      }

      .profile-pill small {
        color: #73877d;
      }

      .avatar {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        font-weight: 700;
        color: #fff;
        background: linear-gradient(135deg, #2f9e69, #58c68a);
      }

      @media (max-width: 991.98px) {
        .topbar-card {
          align-items: stretch;
          flex-direction: column;
        }

        .title-wrap,
        .toolbar {
          width: 100%;
        }

        .toolbar {
          justify-content: flex-start;
        }

        .search-box {
          order: 4;
          flex: 1 1 100%;
        }
      }

      @media (max-width: 575.98px) {
        .topbar-card {
          border-radius: 18px;
          padding: 0.85rem;
        }

        .notifications-menu,
        .settings-menu {
          left: 0;
          right: auto;
          min-width: min(260px, calc(100vw - 2rem));
        }

        .profile-pill {
          width: 100%;
          justify-content: center;
        }

        .profile-pill small {
          display: none;
        }
      }
    `,
  ],
})
export class TopbarComponent {
  private readonly themeService = inject(ThemeService);

  readonly sidebarCollapsed = input(false);
  readonly pageEyebrow = input('Welcome back');
  readonly pageTitle = input('Dashboard Overview');
  readonly pageSubtitle = input('Monitor sales, products, and customer performance in one place.');
  readonly userName = input('Pritam');
  readonly userEmail = input('pritamcareershine@gmail.com');
  readonly menuToggle = output<void>();
  readonly profileSelected = output<void>();
  readonly logoutSelected = output<void>();

  protected readonly settingsOpen = signal(false);
  protected readonly notificationsOpen = signal(false);
  protected readonly isDarkMode = this.themeService.isDarkMode;
  protected readonly notifications = [
    {
      id: 1,
      title: 'New order #DP-2048 placed by Riya Sen',
      message: 'Review the order and confirm shipping for the customer.',
      time: '2 min ago',
      tone: 'success',
      icon: 'bi-bag-check',
      unread: true,
    },
    {
      id: 2,
      title: 'Payment confirmed for invoice #INV-8841',
      message: '₹12,450 has been successfully received via Razorpay.',
      time: '10 min ago',
      tone: 'info',
      icon: 'bi-credit-card-2-front',
      unread: true,
    },
    {
      id: 3,
      title: 'Low stock alert for Wireless Earbuds',
      message: 'Only 6 units left in inventory. Consider restocking soon.',
      time: '32 min ago',
      tone: 'warning',
      icon: 'bi-exclamation-triangle',
      unread: false,
    },
  ];
  protected readonly unreadNotifications = computed(
    () => this.notifications.filter((item) => item.unread).length
  );
  protected readonly userInitials = computed(() =>
    this.userName()
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2) || 'DP'
  );

  protected closeMenus(): void {
    this.notificationsOpen.set(false);
    this.settingsOpen.set(false);
  }

  protected openMenu(event?: Event): void {
    event?.stopPropagation();
    this.notificationsOpen.set(false);
    this.settingsOpen.set(false);
    this.menuToggle.emit();
  }

  protected toggleTheme(event?: Event): void {
    event?.stopPropagation();
    this.themeService.toggleTheme();
  }

  protected toggleNotifications(event?: Event): void {
    event?.stopPropagation();
    this.settingsOpen.set(false);
    this.notificationsOpen.update((value) => !value);
  }

  protected toggleSettings(event?: Event): void {
    event?.stopPropagation();
    this.notificationsOpen.set(false);
    this.settingsOpen.update((value) => !value);
  }

  protected showProfile(event?: Event): void {
    event?.stopPropagation();
    this.notificationsOpen.set(false);
    this.settingsOpen.set(false);
    this.profileSelected.emit();
  }

  protected logout(event?: Event): void {
    event?.stopPropagation();
    this.notificationsOpen.set(false);
    this.settingsOpen.set(false);
    this.logoutSelected.emit();
  }
}
