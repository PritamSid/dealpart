import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { CountrySale } from '../../services/dashboard-data.service';

@Component({
  selector: 'app-sales-by-country',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-card h-100">
      <p class="section-kicker mb-1">Performance</p>
      <h3 class="section-title mb-3">Sales by Country</h3>

      <div class="country-list">
        <div class="country-item" *ngFor="let item of countries()">
          <div class="d-flex justify-content-between align-items-center gap-3 mb-2">
            <div>
              <strong>{{ item.country }}</strong>
              <small>{{ item.sales }}</small>
            </div>
            <span [class.positive]="item.positive" [class.negative]="!item.positive">
              {{ item.change }}
            </span>
          </div>

          <div class="progress-track">
            <div class="progress-value" [style.width.%]="item.progress"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .dashboard-card {
        background: #ffffff;
        border: 1px solid #e5efe8;
        border-radius: 24px;
        padding: 1.15rem;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.06);
      }

      .section-kicker {
        color: #6f8479;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 700;
      }

      .section-title {
        color: #183b2b;
        font-weight: 800;
      }

      .country-list {
        display: grid;
        gap: 1rem;
      }

      .country-item strong {
        display: block;
        color: #183b2b;
      }

      .country-item small {
        color: #748880;
      }

      .positive,
      .negative {
        font-size: 0.82rem;
        font-weight: 700;
      }

      .positive {
        color: #1e8b57;
      }

      .negative {
        color: #dc4c64;
      }

      .progress-track {
        height: 8px;
        border-radius: 999px;
        background: #edf3ef;
        overflow: hidden;
      }

      .progress-value {
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, #2f9e69, #82d6a5);
      }
    `,
  ],
})
export class SalesByCountryComponent {
  readonly countries = input.required<CountrySale[]>();
}
