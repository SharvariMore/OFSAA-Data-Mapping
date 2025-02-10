import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedListService {

  constructor() { }

  private ofsaaPhysicalNamesList: string[] = [];

  setOfsaaPhysicalNamesList(list: string[]): void {
    console.log('Setting ofsaaPhysicalNamesList:', list);
    // this.ofsaaPhysicalNamesList = list;
    if (list && list.length > 0) {
      this.ofsaaPhysicalNamesList = list;
    }
  }

  getOfsaaPhysicalNamesList(): string[] {
    console.log('Getting ofsaaPhysicalNamesList:', this.ofsaaPhysicalNamesList);
    return this.ofsaaPhysicalNamesList;
  }
}
