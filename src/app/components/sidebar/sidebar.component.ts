import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="sidebar-card h-100"
      [class.is-collapsed]="collapsed()"
      [class.is-collapsible]="collapsible()"
      [class.is-mobile-open]="mobileOpen()"
    >
      <div class="sidebar-head mb-3">
        <div class="brand">
          <div class="brand-badge">DP</div>
          <div class="brand-copy" *ngIf="!collapsed()">
            <h5 class="mb-0">DealPart</h5>
            <small>Admin eCommerce</small>
          </div>
        </div>

        <div class="sidebar-actions">
          <button
            type="button"
            class="collapse-btn"
            [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
            (click)="toggleCollapsed.emit()"
          >
            <i
              class="bi"
              [class.bi-layout-sidebar-inset-reverse]="collapsed()"
              [class.bi-layout-sidebar-inset]="!collapsed()"
            ></i>
          </button>

          <button
            *ngIf="collapsible()"
            type="button"
            class="close-btn"
            aria-label="Close sidebar"
            (click)="requestClose.emit()"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <div class="sidebar-groups">
        <section class="sidebar-section">
          <button *ngIf="!collapsed()" type="button" class="section-toggle" (click)="toggleSection('menu')">
            <span class="section-label mb-0">Menu</span>
            <i class="bi" [class.bi-chevron-down]="showMenu()" [class.bi-chevron-right]="!showMenu()"></i>
          </button>

          <div class="section-body" *ngIf="showMenu() || collapsed()">
            <a
              *ngFor="let item of mainItems; let i = index"
              [routerLink]="item.route ?? null"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="nav-link"
              [style.--nav-index]="i"
              [attr.aria-label]="item.label"
              [attr.title]="item.label"
              (click)="handleNavClick(item, $event)"
            >
              <i [class]="item.icon"></i>
              <span *ngIf="!collapsed()">{{ item.label }}</span>
            </a>
          </div>
        </section>

        <section class="sidebar-section">
          <button *ngIf="!collapsed()" type="button" class="section-toggle" (click)="toggleSection('product')">
            <span class="section-label mb-0">Product</span>
            <i class="bi" [class.bi-chevron-down]="showProduct()" [class.bi-chevron-right]="!showProduct()"></i>
          </button>

          <div class="section-body" *ngIf="showProduct() || collapsed()">
            <a
              *ngFor="let item of productItems; let i = index"
              [routerLink]="item.route ?? null"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="nav-link"
              [style.--nav-index]="i + mainItems.length"
              [attr.aria-label]="item.label"
              [attr.title]="item.label"
              (click)="handleNavClick(item, $event)"
            >
              <i [class]="item.icon"></i>
              <span *ngIf="!collapsed()">{{ item.label }}</span>
            </a>
          </div>
        </section>

        <section class="sidebar-section">
          <button *ngIf="!collapsed()" type="button" class="section-toggle" (click)="toggleSection('admin')">
            <span class="section-label mb-0">Admin</span>
            <i class="bi" [class.bi-chevron-down]="showAdmin()" [class.bi-chevron-right]="!showAdmin()"></i>
          </button>

          <div class="section-body" *ngIf="showAdmin() || collapsed()">
            <a
              *ngFor="let item of adminItems; let i = index"
              [routerLink]="item.route ?? null"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="nav-link"
              [style.--nav-index]="i + mainItems.length + productItems.length"
              [attr.aria-label]="item.label"
              [attr.title]="item.label"
              (click)="handleNavClick(item, $event)"
            >
              <i [class]="item.icon"></i>
              <span *ngIf="!collapsed()">{{ item.label }}</span>
            </a>
          </div>
        </section>
      </div>
    </aside>
  `,
  styles: [
    `
      .sidebar-card {
        background: #ffffff;
        border: 1px solid #e5efe8;
        border-radius: 24px;
        padding: 1.25rem;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
        transition:
          padding 0.25s ease,
          border-radius 0.25s ease;
      }

      .sidebar-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        min-width: 0;
      }

      .brand-copy {
        min-width: 0;
      }

      .sidebar-actions {
        display: flex;
        align-items: center;
        gap: 0.45rem;
      }

      .collapse-btn,
      .close-btn {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        border: 1px solid #dbe9df;
        background: #f8fcf9;
        color: #315d45;
      }

      .brand h5 {
        color: #183b2b;
        font-weight: 700;
      }

      .brand small {
        color: #6b7f75;
      }

      .brand-badge {
        width: 46px;
        height: 46px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        color: #fff;
        font-weight: 700;
        background: linear-gradient(135deg, #2f9e69, #82d6a5);
        flex-shrink: 0;
      }

      .sidebar-groups {
        display: grid;
        gap: 0.75rem;
      }

      .sidebar-section {
        border: 1px solid #edf3ef;
        border-radius: 16px;
        padding: 0.45rem;
        background: #fbfdfb;
      }

      .section-toggle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        border: 0;
        background: transparent;
        padding: 0.4rem 0.45rem;
      }

      .section-label {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #7d9087;
        font-weight: 700;
      }

      .section-body {
        padding-top: 0.35rem;
        display: grid;
        gap: 0.25rem;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.8rem 0.9rem;
        border-radius: 14px;
        color: #395446;
        text-decoration: none;
        font-weight: 600;
        position: relative;
        overflow: hidden;
        box-shadow: 0 0 0 rgba(47, 158, 105, 0);
        transition:
          transform 0.2s ease,
          background 0.2s ease,
          color 0.2s ease,
          box-shadow 0.25s ease,
          opacity 0.25s ease;
      }

      .nav-link:hover {
        background: #f4faf6;
        color: #1f7a51;
        transform: translateX(2px);
      }

      .nav-link.active {
        background: linear-gradient(135deg, #edf8f1, #f6fcf8);
        color: #1f7a51;
        box-shadow:
          inset 0 0 0 1px #d8edde,
          0 12px 24px rgba(47, 158, 105, 0.16);
      }

      .nav-link.active::after {
        content: '';
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 50%;
        margin-left: auto;
        background: #2f9e69;
        box-shadow: 0 0 0 0.35rem rgba(47, 158, 105, 0.16);
        flex-shrink: 0;
      }

      .nav-link i {
        font-size: 1rem;
      }

      .sidebar-card.is-collapsed {
        padding: 1rem 0.65rem;
      }

      .sidebar-card.is-collapsed .sidebar-head {
        flex-direction: column;
      }

      .sidebar-card.is-collapsed .brand,
      .sidebar-card.is-collapsed .sidebar-actions {
        justify-content: center;
      }

      .sidebar-card.is-collapsed .sidebar-actions {
        flex-direction: column;
        width: 100%;
      }

      .sidebar-card.is-collapsed .sidebar-section {
        padding: 0;
        border-color: transparent;
        background: transparent;
      }

      .sidebar-card.is-collapsed .section-body {
        padding-top: 0;
      }

      .sidebar-card.is-collapsed .nav-link {
        justify-content: center;
        padding: 0.72rem;
      }

      @media (max-width: 1199.98px) {
        .sidebar-card {
          min-height: 100%;
          border-radius: 20px;
          padding: 1rem;
        }

        .sidebar-groups {
          gap: 0.9rem;
        }
      }

      @media (max-width: 991.98px) {
        .sidebar-card.is-collapsible .section-body .nav-link {
          opacity: 0;
          transform: translateX(-14px);
        }

        .sidebar-card.is-collapsible.is-mobile-open .section-body .nav-link {
          opacity: 1;
          transform: translateX(0);
          transition-delay: calc(var(--nav-index, 0) * 45ms);
        }
      }

      @media (max-width: 575.98px) {
        .nav-link {
          padding: 0.72rem 0.8rem;
          font-size: 0.94rem;
        }
      }
    `,
  ],
})
export class SidebarComponent {
  readonly collapsible = input(false);
  readonly collapsed = input(false);
  readonly mobileOpen = input(false);
  readonly toggleCollapsed = output<void>();
  readonly requestClose = output<void>();

  protected readonly showMenu = signal(true);
  protected readonly showProduct = signal(true);
  protected readonly showAdmin = signal(false);

  protected readonly mainItems: NavItem[] = [
    { label: 'Dashboard', icon: 'bi bi-grid', route: '/dashboard' },
    { label: 'Order Management', icon: 'bi bi-receipt', route: '/order-management' },
    { label: 'Customers', icon: 'bi bi-people', route: '/customers' },
    { label: 'Coupon Code', icon: 'bi bi-ticket-perforated' },
    { label: 'Categories', icon: 'bi bi-collection', route: '/categories' },
    { label: 'Transection', icon: 'bi bi-credit-card', route: '/transaction' },
    { label: 'Brand', icon: 'bi bi-award' },
  ];

  protected readonly productItems: NavItem[] = [
    { label: 'Add Products', icon: 'bi bi-plus-square', route: '/add-products' },
    { label: 'Product Media', icon: 'bi bi-image' },
    { label: 'Product List', icon: 'bi bi-card-list' },
    { label: 'Product Reviews', icon: 'bi bi-chat-left-text' },
  ];

  protected readonly adminItems: NavItem[] = [
    { label: 'Admin role', icon: 'bi bi-shield-check', route: '/admin-role' },
    { label: 'Control Authority', icon: 'bi bi-sliders' },
  ];

  protected toggleSection(section: 'menu' | 'product' | 'admin'): void {
    if (section === 'menu') {
      this.showMenu.update((value) => !value);
      return;
    }

    if (section === 'product') {
      this.showProduct.update((value) => !value);
      return;
    }

    this.showAdmin.update((value) => !value);
  }

  protected handleNavClick(item: NavItem, event: Event): void {
    if (!item.route) {
      event.preventDefault();
      return;
    }

    if (this.collapsible()) {
      this.requestClose.emit();
    }
  }
}
