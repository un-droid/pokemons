import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../pokemon-types';
import { Subscription } from 'rxjs';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  pokemons:Pokemon[] = [];
  private pokemonsSub = new Subscription();

  constructor(private pokemonService: PokemonService, private logger: LoggerService) { }
  
  ngOnDestroy(): void {
    this.pokemonsSub.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.debug('init HomeComponent');
    this.pokemonsSub = this.pokemonService.PokemonList$.subscribe(result => this.pokemons = result);
  }

  addPokemonToCart(pokemon: Pokemon):void{
    const addedPokemonId = this.pokemonService.addPokemonToCart(pokemon);
    if(addedPokemonId === -1){
      this.logger.debug("unable to add pokemon to cart, its not found in the pokemons list");
      return;
    }
    const addedPokemon = this.pokemons.find(pok => pok.id === addedPokemonId);
    if(addedPokemon){
      addedPokemon.addedToCart = true;
    }
  }
  public trackByFn(pokemon):number {
    return pokemon.id;
  }
}
