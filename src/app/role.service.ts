import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  // private role: 'user' | 'admin' | undefined;

  // Use BehaviorSubject to maintain and observe the role
  private roleSubject = new BehaviorSubject<'User' | 'Admin' | undefined>(undefined);

  // Observable to expose current role
  role$ = this.roleSubject.asObservable();

  getRole(): 'User' | 'Admin' | undefined{
    // return this.role;
    return this.roleSubject.getValue();
  }

  setRole(role: 'User' | 'Admin'): void {
    // this.role = role;
    this.roleSubject.next(role);
  }

  toggleRole(): void {
    const currentRole = this.roleSubject.getValue();
    const newRole = currentRole === 'User' ? 'Admin' : 'User';
    this.roleSubject.next(newRole);
  }

}
