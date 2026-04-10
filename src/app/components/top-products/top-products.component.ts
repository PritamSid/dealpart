import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TopProductItem } from '../../services/dashboard-data.service';

@Component({
  selector: 'app-top-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-card h-100">
      <p class="section-kicker mb-1">Catalog</p>
      <h3 class="section-title mb-3">Top Products</h3>

      <div class="product-list">
        <div class="product-item" *ngFor="let item of products()">
          <div class="thumb" [ngClass]="item.tone">
            <i [class]="item.icon"></i>
          </div>

          <div class="flex-grow-1">
            <strong>{{ item.name }}</strong>
            <small>{{ item.subtitle }}</small>
          </div>

          <span class="price">{{ item.price }}</span>
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

      .product-list {
        display: grid;
        gap: 0.85rem;
      }

      .product-item {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 0.75rem;
        border-radius: 16px;
        background: #f8fcf9;
        border: 1px solid #ebf2ed;
      }

      .thumb {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: grid;
        place-items: center;
      }

      .thumb i {
        font-size: 1.1rem;
      }

      strong {
        display: block;
        color: #173a2a;
      }

      small {
        color: #748880;
      }

      .price {
        color: #173a2a;
        font-weight: 800;
      }

      .mint {
        background: #e9f8ef;
        color: #1e8b57;
      }

      .peach {
        background: #fff3ea;
        color: #d87a1d;
      }

      .sky {
        background: #eef4ff;
        color: #4461f2;
      }
    `,
  ],
})
export class TopProductsComponent {
  readonly products = input.required<TopProductItem[]>();
}
