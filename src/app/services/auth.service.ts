import { Injectable } from '@angular/core';

export interface User {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor() { }

  signup(email: string, password: string): { success: boolean; message: string } {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    const users = this.getUsers();
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return { success: false, message: 'Email already exists.' };
    }

    const newUser: User = { email: email.toLowerCase(), password, name: 'User', role: 'User' };
    users.push(newUser);
    this.saveUsers(users);

    return { success: true, message: 'Signup successful.' };
  }

  login(email: string, password: string): boolean {
    if (!email || !password) {
      return false;
    }

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.CURRENT_USER_KEY) !== null;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  getUsers(): User[] {
    const usersStr = localStorage.getItem(this.USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }
}
