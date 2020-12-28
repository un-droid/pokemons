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
  pokemonsInCart:Pokemon[] = [];
  private cartPokemonsSub = new Subscription();
  
  constructor(private auth: AuthService, private logger: LoggerService, private pokemonService: PokemonService) { }

  ngOnDestroy(): void {
    this.cartPokemonsSub.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.debug('init HeaderComponent');
    this.cartPokemonsSub = this.pokemonService.pokemonsInCartList$.subscribe(result => this.pokemonsInCart = result);
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }

}
