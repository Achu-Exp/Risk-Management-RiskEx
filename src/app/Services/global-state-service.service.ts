import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateServiceService {

  constructor() { }
  dataSignal = signal<{ approve: string }>({ approve: '' });

  crumps= signal<any>([{title:"Dashbaord",route:"/home"}]);







  get data() {
    return this.dataSignal.asReadonly();
  }

 public addToCrumps(value:any)
  {
    this.crumps.update((items:any) => [...items, value]);
  }


  setData(value: { approve: string }): void {
    this.dataSignal.set(value);
  }
}
