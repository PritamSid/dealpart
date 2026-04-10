import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { BestSellingItem } from '../../services/dashboard-data.service';

@Component({
  selector: 'app-best-selling-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-card h-100">
      <p class="section-kicker mb-1">Revenue Drivers</p>
      <h3 class="section-title mb-3">Best Selling Products</h3>

      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Product name</th>
              <th>Total orders</th>
              <th>Status</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of products()">
              <td class="fw-semibold">{{ item.name }}</td>
              <td>{{ item.totalOrders }}</td>
              <td>
                <span class="stock-pill" [class.out]="item.status === 'Stock out'">
                  {{ item.status }}
                </span>
              </td>
              <td class="fw-semibold">{{ item.price }}</td>
            </tr>
          </tbody>
        </table>
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

      th {
        color: #6e8378;
        font-size: 0.79rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom-color: #edf3ef;
      }

      td {
        color: #254435;
        border-bottom-color: #f1f5f3;
      }

      .stock-pill {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 0.28rem 0.65rem;
        background: #e9f8ef;
        color: #1e8b57;
        font-size: 0.8rem;
        font-weight: 700;
      }

      .stock-pill.out {
        background: #fff0f0;
        color: #dc4c64;
      }
    `,
  ],
})
export class BestSellingTableComponent {
  readonly products = input.required<BestSellingItem[]>();
}
