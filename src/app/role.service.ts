import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private role: 'user' | 'admin' | undefined;

  getRole(): 'user' | 'admin' | undefined{
    return this.role;
  }

  setRole(role: 'user' | 'admin') {
    this.role = role;
  }


}
