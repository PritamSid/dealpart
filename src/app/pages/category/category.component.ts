import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';

type ProductTab = 'all' | 'featured' | 'sale' | 'out-of-stock';

interface CategoryCard {
  name: string;
  icon: string;
  accent: string;
}

interface ProductRow {
  no: number;
  name: string;
  createdDate: string;
  orderCount: number;
  icon: string;
  tab?: ProductTab;
}

@Component({
  selector: 'app-category',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  protected readonly tabs = [
    { label: 'All Product', value: 'all' as const, count: 145 },
    { label: 'Featured Products', value: 'featured' as const },
    { label: 'On Sale', value: 'sale' as const },
    { label: 'Out of Stock', value: 'out-of-stock' as const },
  ];

  protected readonly categories = signal<CategoryCard[]>([]);
  protected readonly products = signal<ProductRow[]>([]);
  protected readonly apiService = inject(ApiService);

  constructor() {
    this.apiService.getCategories().subscribe((categories) => this.categories.set(categories));
    this.apiService.getProducts('all').subscribe((products) => this.products.set(products));
  }

  protected readonly activeTab = signal<ProductTab>('all');
  protected readonly searchTerm = signal('');
  protected readonly page = signal(1);
  protected readonly pageNumbers = [1, 2, 3, 4, 5];
  protected readonly totalPages = 24;

  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const activeTab = this.activeTab();

    return this.products().filter((product) => {
      const matchesTab = activeTab === 'all' || product.tab === activeTab;
      const matchesSearch = !term || product.name.toLowerCase().includes(term);

      return matchesTab && matchesSearch;
    });
  });

  protected setActiveTab(tab: ProductTab): void {
    this.activeTab.set(tab);
    this.page.set(1);
    this.apiService.getProducts(tab).subscribe((products) => this.products.set(products));
  }

  protected updateSearch(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.searchTerm.set(target?.value ?? '');
    this.page.set(1);
  }

  protected previousPage(): void {
    this.page.update((value) => Math.max(1, value - 1));
  }

  protected nextPage(): void {
    this.page.update((value) => Math.min(this.totalPages, value + 1));
  }

  protected selectPage(pageNumber: number): void {
    this.page.set(pageNumber);
  }
}
