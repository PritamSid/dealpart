import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { StatCard } from '../../services/dashboard-data.service';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="stat-card" [ngClass]="data().tone">
      <div class="icon-wrap">
        <i [class]="data().icon"></i>
      </div>

      <div>
        <p class="stat-label mb-1">{{ data().title }}</p>
        <h3 class="stat-value mb-1">{{ data().value }}</h3>
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <span class="trend-pill" [class.negative]="data().tone === 'danger'">
            {{ data().change }}
          </span>
          <small>{{ data().meta }}</small>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .stat-card {
        background: #ffffff;
        border: 1px solid #e5efe8;
        border-radius: 22px;
        padding: 1rem;
        box-shadow: 0 18px 35px rgba(15, 23, 42, 0.06);
        display: flex;
        gap: 0.9rem;
        min-height: 100%;
      }

      .icon-wrap {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .icon-wrap i {
        font-size: 1.1rem;
      }

      .stat-label,
      small {
        color: #6f8479;
      }

      .stat-value {
        color: #183b2b;
        font-size: 1.6rem;
        font-weight: 800;
      }

      .trend-pill {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 0.2rem 0.55rem;
        background: #e9f8ef;
        color: #1e8b57;
        font-size: 0.78rem;
        font-weight: 700;
      }

      .trend-pill.negative {
        background: #fff0f0;
        color: #dc4c64;
      }

      .success .icon-wrap {
        background: #e9f8ef;
        color: #1e8b57;
      }

      .primary .icon-wrap {
        background: #eef4ff;
        color: #4461f2;
      }

      .warning .icon-wrap {
        background: #fff6e8;
        color: #d98a00;
      }

      .danger .icon-wrap {
        background: #fff0f0;
        color: #dc4c64;
      }
    `,
  ],
})
export class StatCardComponent {
  readonly data = input.required<StatCard>();
}
