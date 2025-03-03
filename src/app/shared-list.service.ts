import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedListService {

  constructor() { }

  // private ofsaaPhysicalNamesListSource = new BehaviorSubject<string[]>((this.getFromLocalStorage()));
  private ofsaaPhysicalNamesListSource = new BehaviorSubject<string[]>([]);
  ofsaaPhysicalNamesList$ = this.ofsaaPhysicalNamesListSource.asObservable();

  private ofsaaStageTableNameListSource = new BehaviorSubject<string[]>([]);
  ofsaaStageTableNameList$ = this.ofsaaStageTableNameListSource.asObservable();

  setOfsaaPhysicalNamesList(names: string[]): void {
    // localStorage.setItem('ofsaaPhysicalNamesList', JSON.stringify(names));
    this.ofsaaPhysicalNamesListSource.next(names);
  }

  getOfsaaPhysicalNamesList(): string[] {
      return this.ofsaaPhysicalNamesListSource.getValue();
    }


  setofsaaStageTableNameList(names: string[]): void {
    // localStorage.setItem('ofsaaPhysicalNamesList', JSON.stringify(names));
    this.ofsaaStageTableNameListSource.next(names);
  }
  
  getofsaaStageTableNameList(): string[] {
      return this.ofsaaStageTableNameListSource.getValue();
    }
    // private getFromLocalStorage(): string[] {
    //   const storedData = localStorage.getItem('ofsaaPhysicalNamesList');
    //   return storedData ? JSON.parse(storedData) : [];
    // }
}
