import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

type TaxIncludedOption = 'Yes' | 'No';
type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

interface SelectOption {
  label: string;
  value: string;
}

interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

type PreviewImageId = 'main' | 'front' | 'back';

interface PreviewImage {
  id: PreviewImageId;
  title: string;
  caption: string;
  src: string;
}

@Component({
  selector: 'app-add-products',
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.scss',
})
export class AddProductsComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly saleValue = '$900.89';
  protected readonly taxOptions: TaxIncludedOption[] = ['Yes', 'No'];
  protected readonly stockStatuses: StockStatus[] = ['In Stock', 'Low Stock', 'Out of Stock'];

  protected readonly categoryOptions: SelectOption[] = [
    { label: 'Select your product', value: '' },
    { label: 'Smartphones', value: 'smartphones' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Featured Launches', value: 'featured-launches' },
  ];

  protected readonly tagOptions: SelectOption[] = [
    { label: 'Select your product', value: '' },
    { label: 'Apple', value: 'apple' },
    { label: 'Premium', value: 'premium' },
    { label: 'New Arrival', value: 'new-arrival' },
  ];

  protected readonly colorOptions: ColorOption[] = [
    { id: 'sage', label: 'Soft Sage', hex: '#dbeedd' },
    { id: 'rose', label: 'Blush Pink', hex: '#f7d6df' },
    { id: 'mist', label: 'Cloud Grey', hex: '#e9edf1' },
    { id: 'sand', label: 'Warm Sand', hex: '#f3e8cf' },
    { id: 'graphite', label: 'Graphite', hex: '#5c6470' },
  ];

  protected readonly productForm = this.fb.group({
    pageSearch: [''],
    productName: ['iPhone 15'],
    productDescription: [
      'The iPhone 15 delivers cutting-edge performance with the A16 Bionic chip, an immersive Super Retina XDR display, advanced dual-camera system, and exceptional battery life, all encased in stunning aerospace-grade aluminum.',
    ],
    productPrice: ['$999.89'],
    discountedPrice: ['$99'],
    taxIncluded: this.fb.control<TaxIncludedOption>('Yes'),
    startDate: ['2026-03-31'],
    endDate: ['2026-04-30'],
    stockQuantity: ['Unlimited'],
    stockStatus: this.fb.control<StockStatus>('In Stock'),
    unlimited: [true],
    featured: [true],
    category: [''],
    tag: [''],
  });

  protected readonly mainImage = 'assets/images/main-product.png';
  protected readonly frontImage = 'assets/images/product-front.png';
  protected readonly backImage = 'assets/images/product-back.png';

  protected readonly selectedColor = signal('sage');
  protected readonly selectedPreviewId = signal<PreviewImageId>('main');
  protected readonly previewImages: PreviewImage[] = [
    {
      id: 'main',
      title: 'Main Preview',
      caption: 'Front product preview for iPhone 15',
      src: this.mainImage,
    },
    {
      id: 'front',
      title: 'Front Product Image',
      caption: 'Clean front-facing product view.',
      src: this.frontImage,
    },
    {
      id: 'back',
      title: 'Back Product Image',
      caption: 'Back finish and camera layout preview.',
      src: this.backImage,
    },
  ];
  protected readonly mainPreview = computed(
    () => this.previewImages.find((image) => image.id === 'main') ?? this.previewImages[0]
  );
  protected readonly sidePreviewImages = computed(() =>
    this.previewImages.filter((image) => image.id !== 'main')
  );
  protected readonly selectedColorLabel = computed(
    () => this.colorOptions.find((color) => color.id === this.selectedColor())?.label ?? 'Soft Sage'
  );

  protected selectColor(colorId: string): void {
    this.selectedColor.set(colorId);
  }

  protected selectPreview(previewId: PreviewImageId): void {
    this.selectedPreviewId.set(previewId);
  }

  protected toggleUnlimited(): void {
    const unlimitedControl = this.productForm.controls.unlimited;
    unlimitedControl.setValue(!unlimitedControl.value);
  }
}
