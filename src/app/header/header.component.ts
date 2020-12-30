import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoggerService } from '../logger.service';
import { Pokemon } from '../pokemon-types';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = this.auth.isLoggedIn$;

  pokemonsInCartCount:number = 0;
  private pokemonsInCartNumSub = new Subscription();
  
  constructor(private auth: AuthService, private logger: LoggerService, private pokemonService: PokemonService) { }

  ngOnDestroy(): void {
    this.pokemonsInCartNumSub.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.debug('init HeaderComponent');
    this.pokemonsInCartNumSub = this.pokemonService.PokemonsInCartAmount$.subscribe(result => this.pokemonsInCartCount = result);
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }

}
