import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NewProductItem, ProductCategory } from '../../services/dashboard-data.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-card">
      <div class="d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap">
        <div>
          <p class="section-kicker mb-1">Quick Action</p>
          <h3 class="section-title mb-0">Add New Product</h3>
        </div>

        <div class="category-pills">
          <span class="category-pill" *ngFor="let item of categories()">
            {{ item.name }} · {{ item.total }}
          </span>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-md-4" *ngFor="let item of products()">
          <div class="product-card h-100">
            <div class="thumb" [ngClass]="item.tone">
              <i [class]="item.icon"></i>
            </div>

            <div>
              <span class="badge rounded-pill text-bg-light mb-2">{{ item.category }}</span>
              <h4>{{ item.name }}</h4>
              <p class="meta mb-2">{{ item.stock }}</p>
              <div class="d-flex justify-content-between align-items-center gap-3">
                <strong>{{ item.price }}</strong>
                <button type="button" class="btn btn-success btn-sm px-3 rounded-pill">Add</button>
              </div>
            </div>
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

      .category-pills {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .category-pill {
        border-radius: 999px;
        padding: 0.35rem 0.75rem;
        background: #f1f8f4;
        color: #2c6c4d;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .product-card {
        display: flex;
        gap: 0.2rem;
        align-items: flex-start;
        padding: 0.95rem;
        border-radius: 18px;
        border: 1px solid #ebf2ed;
        background: #f8fcf9;
      }

      .thumb {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        border-radius: 8px;
        display: grid;
        place-items: center;
      }

      .thumb i {
        font-size: 1.25rem;
      }

      h4 {
        font-size: 14px;
        margin-bottom: 0.25rem;
        color: #173a2a;
        font-weight: 700;
        word-break: keep-all;
      }
.rounded-pill{
    text-align: left;
    padding: 0;
    font-size: 12px;
}
      .meta {
        color: #748880;
        font-size: 14px;
      }

      strong {
        color: #173a2a;
        font-size: 14px;
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
export class AddProductComponent {
  readonly categories = input.required<ProductCategory[]>();
  readonly products = input.required<NewProductItem[]>();
}
