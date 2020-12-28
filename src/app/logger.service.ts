import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  public info(message: string) {
    console.log(message);
  }

  public debug(message: string) {
    console.log(message);
  }
}
