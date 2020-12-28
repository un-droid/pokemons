import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private logger: LoggerService) { }

  public init() {
    this.logger.debug('init AuthService');
  }

  public login() {
    this.logger.info('login');
    this.isLoggedIn.next(true);
  }

  public logout() {
    this.logger.info('logout');
    this.isLoggedIn.next(false);
  }
}
