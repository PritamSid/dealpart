import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AUTH_STORAGE_KEY } from './services/auth.service';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the auth screen by default', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(router.url).toBe('/login');
    expect(compiled.textContent).toContain('Welcome back to Deal Part');
    expect(compiled.textContent).toContain('Login');
    expect(compiled.textContent).toContain('Signup');
  });

  it('should redirect unauthenticated users to login when opening a protected route', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/dashboard');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(router.url).toBe('/login');
    expect(compiled.textContent).toContain('Welcome back to Deal Part');
  });

  it('should login with the demo credentials and navigate to the dashboard', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/login');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const loginButton = Array.from(compiled.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Login to Dashboard')
    ) as HTMLButtonElement | undefined;

    expect(loginButton).toBeTruthy();

    loginButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/dashboard');
    expect(compiled.textContent).toContain('Dashboard Overview');
  });

  it('should render the dashboard shell for an authenticated user', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        name: 'Pritam',
        email: 'pritamcareershine@gmail.com',
        role: 'Dashboard Admin',
      })
    );

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/dashboard');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const settingsButton = compiled.querySelector(
      'button[aria-label="Open settings menu"]'
    ) as HTMLButtonElement | null;

    expect(compiled.querySelector('h2')?.textContent).toContain('Dashboard Overview');
    expect(compiled.querySelector('input')?.getAttribute('placeholder')).toBe(
      'Search data, users, or reports'
    );
    const themeButton = compiled.querySelector(
      'button[aria-label="Switch to dark mode"]'
    ) as HTMLButtonElement | null;

    expect(compiled.textContent).toContain('Weekly Report');
    expect(compiled.textContent).toContain('Best Selling Products');
    expect(settingsButton).not.toBeNull();
    expect(themeButton).not.toBeNull();
    expect(compiled.textContent).not.toContain('Logout');

    themeButton?.click();
    fixture.detectChanges();

    expect(document.body.classList.contains('dark-mode')).toBe(true);

    settingsButton?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Logout');
  });

  it('should open the notifications dropdown with demo data', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        name: 'Pritam',
        email: 'pritamcareershine@gmail.com',
        role: 'Dashboard Admin',
      })
    );

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/dashboard');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const bellButton = compiled.querySelector(
      'button[aria-label="Open notifications"]'
    ) as HTMLButtonElement | null;

    expect(bellButton).not.toBeNull();

    bellButton?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Notifications');
    expect(compiled.textContent).toContain('New order #DP-2048 placed by Riya Sen');
    expect(compiled.textContent).toContain('Payment confirmed for invoice #INV-8841');
  });

  it('should navigate to the categories page', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        name: 'Pritam',
        email: 'pritamcareershine@gmail.com',
        role: 'Dashboard Admin',
      })
    );

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/categories');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const discoverSearchInput = compiled.querySelector(
      'input[placeholder="Search your product"]'
    ) as HTMLInputElement | null;

    expect(compiled.querySelector('.topbar-card .page-title')?.textContent).toContain('Discover');
    expect(compiled.textContent).toContain('Add Product');
    expect(compiled.textContent).toContain('Electronics');
    expect(compiled.textContent).toContain('Wireless Bluetooth Headphones');
    expect(discoverSearchInput).not.toBeNull();
    expect(discoverSearchInput?.getAttribute('placeholder')).toBe('Search your product');
  });

  it('should navigate to the transaction page', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        name: 'Pritam',
        email: 'pritamcareershine@gmail.com',
        role: 'Dashboard Admin',
      })
    );

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/transaction');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const transactionSearchInput = compiled.querySelector(
      'input[placeholder="Search payment history"]'
    ) as HTMLInputElement | null;

    expect(compiled.querySelector('.topbar-card .page-title')?.textContent).toContain('Transaction');
    expect(compiled.textContent).toContain('Total Revenue');
    expect(compiled.textContent).toContain('Payment Method');
    expect(transactionSearchInput).not.toBeNull();
    expect(transactionSearchInput?.getAttribute('placeholder')).toBe('Search payment history');
    expect(compiled.textContent).toContain('View Details');
  });

  it('should navigate to the add products page', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        name: 'Pritam',
        email: 'pritamcareershine@gmail.com',
        role: 'Dashboard Admin',
      })
    );

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/add-products');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const addProductSearchInput = compiled.querySelector(
      'input[placeholder="Search product for add"]'
    ) as HTMLInputElement | null;

    expect(compiled.querySelector('.topbar-card .page-title')?.textContent).toContain('Add New Product');
    expect(compiled.textContent).toContain('Basic Details');
    expect(compiled.textContent).toContain('Upload Product Image');
    expect(compiled.textContent).toContain('Publish Product');
    expect(addProductSearchInput).not.toBeNull();
    expect(addProductSearchInput?.getAttribute('placeholder')).toBe('Search product for add');
  });

  it('should navigate to the admin role page', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        name: 'Pritam',
        email: 'pritamcareershine@gmail.com',
        role: 'Dashboard Admin',
      })
    );

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/admin-role');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.topbar-card .page-title')?.textContent).toContain('About section');
    expect(compiled.textContent).toContain('Profile Update');
    expect(compiled.textContent).toContain('Change Password');
    expect(compiled.textContent).toContain('Save Change');
    expect(compiled.textContent).toContain('Wade Warren');
  });

  it('should navigate to the customers page', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        name: 'Pritam',
        email: 'pritamcareershine@gmail.com',
        role: 'Dashboard Admin',
      })
    );

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/customers');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.topbar-card .page-title')?.textContent).toContain(
      'Customer Management'
    );
    expect(compiled.textContent).toContain('Total Customers');
    expect(compiled.textContent).toContain('Customer Overview');
    expect(compiled.textContent).toContain('John Doe');
    expect(compiled.textContent).toContain('Emily Davis');
    expect(compiled.textContent).toContain('Add Customer');

    const detailsButton = compiled.querySelector(
      'button[aria-label="View John Doe"]'
    ) as HTMLButtonElement | null;

    expect(detailsButton).not.toBeNull();

    detailsButton?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Customer Details');
    expect(compiled.textContent).toContain('john.doe@dealpart.demo');
  });
  it('should navigate to the order management page', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        name: 'Pritam',
        email: 'pritamcareershine@gmail.com',
        role: 'Dashboard Admin',
      })
    );

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/order-management');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.topbar-card .eyebrow')?.textContent).toContain('Operations');
    expect(compiled.querySelector('.topbar-card .page-title')?.textContent).toContain(
      'Order Management'
    );
    expect(compiled.textContent).toContain(
      'Track, review, and manage incoming orders with live demo data.'
    );
  });
});
