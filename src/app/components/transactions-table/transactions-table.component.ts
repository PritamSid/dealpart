import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TransactionItem } from '../../services/dashboard-data.service';

@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-card h-100">
      <div class="d-flex justify-content-between align-items-center gap-3 mb-3">
        <div>
          <p class="section-kicker mb-1">Recent Orders</p>
          <h3 class="section-title mb-0">Transactions</h3>
        </div>
        <a href="#" class="text-success fw-semibold text-decoration-none">View all</a>
      </div>

      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>No</th>
              <th>Customer ID</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of transactions()">
              <td>{{ item.no }}</td>
              <td class="fw-semibold">{{ item.customerId }}</td>
              <td>{{ item.orderDate }}</td>
              <td>
                <span class="status-pill" [class.pending]="item.status === 'Pending'">
                  <span class="dot"></span>
                  {{ item.status }}
                </span>
              </td>
              <td class="fw-semibold">{{ item.amount }}</td>
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

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        border-radius: 999px;
        padding: 0.3rem 0.7rem;
        background: #e9f8ef;
        color: #1e8b57;
        font-size: 0.8rem;
        font-weight: 700;
      }

      .status-pill.pending {
        background: #fff6e8;
        color: #cb8a0d;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
      }
    `,
  ],
})
export class TransactionsTableComponent {
  readonly transactions = input.required<TransactionItem[]>();
}
