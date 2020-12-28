import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from './logger.service';
import { ApiClientService } from './api-client.service';
import { Subscription, BehaviorSubject, of } from 'rxjs';
import { Pokemon } from './pokemon-types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonService implements OnInit, OnDestroy {
  //all pokemons
  private pokemonList = new BehaviorSubject<Pokemon[]>([]);
  PokemonList$ = this.pokemonList.asObservable();
  private pokemonsSub = new Subscription();
  //cart pokemons
  private pokemonsInCartList = new BehaviorSubject<Pokemon[]>([]);
  pokemonsInCartList$ = this.pokemonsInCartList.asObservable();
  private pokemonsInCarSub = new Subscription();
  //auth
  private isLoggedSub = new Subscription();
  private logged: boolean = false;

  constructor(
    private logger: LoggerService,
    private apiClient: ApiClientService,
    private auth: AuthService
  ) {}

  ngOnDestroy(): void {
    this.pokemonsInCarSub.unsubscribe();
    this.pokemonsSub.unsubscribe();
    this.isLoggedSub.unsubscribe();
  }

  ngOnInit(): void {
    try {
      this.pokemonsSub = this.apiClient.getPokemons().subscribe((response) => {
        if (response !== undefined) {
          this.pokemonList.next(response);
          this.logger.info(`Got ${response.length} pokemons`);
          this.pokemonsSub.unsubscribe();
        }
      });
    } catch {
      this.logger.debug('error getting pokemons from backend');
    }
    this.isLoggedSub = this.auth.isLoggedIn$.subscribe((result) => {
      if (result === true) {
        this.loadPokemonsToCartFromLocalStorage(result);
      }
      return (this.logged = result);
    });
  }

  public addPokemonToCart(pokemon: Pokemon): number {
    try {
      if (pokemon) {
        const currentCartPokemons = this.pokemonsInCartList.value;
        const updatedValue = [...currentCartPokemons, pokemon];
        this.pokemonsInCartList.next(updatedValue);
        this.logger.info(`${pokemon.name} was added to the cart`);

        if (this.logged) {
          this.logger.info(`a user is logged in. modifying pokemon cart in local storage`);
          localStorage.setItem('cartedPokemons', JSON.stringify(updatedValue));
        }

        return pokemon.id;
      }
    } catch {
      this.logger.debug(`error adding ${pokemon.name} to the cart`);
      return -1;
    }
  }

  public removePokemonFromCart(pokemon: Pokemon): void {
    try{
      if (pokemon) {
        let currentCartPokemons = this.pokemonsInCartList.value;
        currentCartPokemons = currentCartPokemons.filter(
          (pok) => pok.name !== pokemon.name
        );
  
        this.pokemonsInCartList.next(currentCartPokemons);
        this.logger.info(`${pokemon.name} was removed from the cart`);
  
        if (this.logged) {
          this.logger.info(`a user is logged in. modifying pokemon cart in local storage`);
          localStorage.setItem('cartedPokemons',JSON.stringify(currentCartPokemons));
        }
  
        //update removed pokemon with the addedToCart property to show the + in the home component
        const allPokemons = this.pokemonList.value;
  
        const addedPokemon = allPokemons.find((pok) => pok.name === pokemon.name);
        if (addedPokemon) {
          addedPokemon.addedToCart = false;
          this.pokemonList.next(allPokemons);
        }
      }
    }catch{
      this.logger.debug(`error removing pokemon from cart`);
    }
  }

  clearAllPokemonsFromCart(): void {
    try{
      this.logger.info(`clearing pokemon cart`);
    //clear cart list
    this.pokemonsInCartList.next([]);
    //reset addedToCart property of pokemons in main list
    const allPokemons = this.pokemonList.value;
    //i think resetting all pokemons is faster than filtering out the names of pokemons which were in the cart and iterating over the whole list again to affect only them
    allPokemons.forEach((pok) => (pok.addedToCart = false));
    this.pokemonList.next(allPokemons);
    if (this.logged) {
      this.logger.info(`a user is logged in. removing all pokemons from local storage`);
      localStorage.removeItem('cartedPokemons');
    }
    }catch{
      this.logger.debug(`error clearing pokemons from cart`);
    }
  }

  loadPokemonsToCartFromLocalStorage(logged): void {
    try{
      if (logged) {
        this.logger.info(`a user just logged in. checking localStorage for saved pokemon cart`);
        const cartedPokemonsStr = localStorage.getItem('cartedPokemons');
        if (cartedPokemonsStr) {
          const parsedCartedPokemons = JSON.parse(cartedPokemonsStr);
          this.logger.info(`existing pokemons cart found`);
          this.pokemonsInCartList.next(parsedCartedPokemons);
          //remove plus icon from pokemons which are already in the cart
          const allPokemons = this.pokemonList.value;
          parsedCartedPokemons.forEach((cartPok) => {
            const tmpPokIndex = allPokemons.findIndex(
              (pok) => pok.name === cartPok.name
            );
            if (tmpPokIndex !== -1) {
              allPokemons[tmpPokIndex].addedToCart = true;
            }
          });
          this.pokemonList.next(allPokemons);
        }
      }
    }catch{
      this.logger.debug(`error loading pokemons cart from storage`);
    }
  }
}
