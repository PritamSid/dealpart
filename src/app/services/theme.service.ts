import { DOCUMENT } from '@angular/common';
import { computed, effect, Injectable, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'deal-part-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly themeState = signal<ThemeMode>(this.readStoredTheme());

  readonly isDarkMode = computed(() => this.themeState() === 'dark');
  readonly currentTheme = computed(() => this.themeState());

  constructor() {
    effect(() => {
      this.applyTheme(this.themeState());
    });
  }

  setDarkMode(): void {
    this.persistTheme('dark');
  }

  setLightMode(): void {
    this.persistTheme('light');
  }

  toggleTheme(): void {
    if (this.isDarkMode()) {
      this.setLightMode();
      return;
    }

    this.setDarkMode();
  }

  getCurrentTheme(): ThemeMode {
    return this.themeState();
  }

  private persistTheme(theme: ThemeMode): void {
    this.themeState.set(theme);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }

  private readStoredTheme(): ThemeMode {
    if (typeof localStorage === 'undefined') {
      return 'light';
    }

    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: ThemeMode): void {
    this.document.body.classList.toggle('dark-mode', theme === 'dark');
    this.document.body.classList.toggle('light-mode', theme === 'light');
    this.document.documentElement.setAttribute('data-bs-theme', theme);
  }
}
