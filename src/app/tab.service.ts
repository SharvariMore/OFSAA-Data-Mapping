import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private activeTabSubject = new BehaviorSubject<string>('Pre-Stage Table');
  activeTab$ = this.activeTabSubject.asObservable();

  setActiveTab(tab: string) {
    this.activeTabSubject.next(tab);
  }

  constructor() { }
}