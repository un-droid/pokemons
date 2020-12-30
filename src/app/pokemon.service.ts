import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from './logger.service';
import { ApiClientService } from './api-client.service';
import { Subscription, BehaviorSubject } from 'rxjs';
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

  //tracks the nuber of pokemon in cart
  private pokemonsInCartAmount = new BehaviorSubject<number>(0);
  PokemonsInCartAmount$ = this.pokemonsInCartAmount.asObservable();
  private inCartNumSub = new Subscription();

  //auth
  private isLoggedSub = new Subscription();
  private logged: boolean = false;

  constructor(
    private logger: LoggerService,
    private apiClient: ApiClientService,
    private auth: AuthService
  ) {}

  ngOnDestroy(): void {
    this.pokemonsSub.unsubscribe();
    this.isLoggedSub.unsubscribe();
    this.inCartNumSub.unsubscribe();
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
      this.logger.info('error getting pokemons from backend');
    }
    this.isLoggedSub = this.auth.isLoggedIn$.subscribe((result) => {
      if (result === true) {
        this.loadPokemonsToCartFromLocalStorage(result);
      }
      return (this.logged = result);
    });
  }

  /**
   * adds a desired pokemon to the cart
   * @param pokemon the pokemon which will be added to the cart
   */
  public addPokemonToCart(pokemon: Pokemon): number {
    try {
      if (pokemon) {
        const currentPokemons = this.pokemonList.value;
        const addedPokemonIndex = currentPokemons.findIndex(pok => pok.id === pokemon.id);
        currentPokemons[addedPokemonIndex].addedToCart = true;
        this.pokemonList.next(currentPokemons);
        this.logger.info(`${pokemon.name} was added to the cart`);

        //update number of pokemons in cart
        let numOfPokemonsInCart = this.pokemonsInCartAmount.value;
        this.pokemonsInCartAmount.next(++numOfPokemonsInCart);

        if (this.logged) {
          this.logger.info(`a user is logged in. modifying pokemon cart in local storage`);
          //store the ids of pokemons added to cart and storage
          const pokemonsInCartIds = currentPokemons.reduce((ids, pokemon) =>{
            if(pokemon.addedToCart === true){
                ids.push(pokemon.id);
            }
            return ids;
        }, []);

          localStorage.setItem('cartedPokemons', JSON.stringify(pokemonsInCartIds));
        }

        return pokemon.id;
      }
    } catch {
      this.logger.info(`error adding ${pokemon.name} to the cart`);
      return -1;
    }
  }

  /**
   * removes the recieved pokemon from the cart
   * @param pokemon pokemon to be removed from cart
   */
  public removePokemonFromCart(pokemon: Pokemon): void {
    try{
      if (pokemon) {
        const allPokemons = this.pokemonList.value;
        const addedPokemonIndex = allPokemons.findIndex(pok => pok.id === pokemon.id);
        allPokemons[addedPokemonIndex].addedToCart = false;

        this.pokemonList.next(allPokemons);
        this.logger.info(`${pokemon.name} was removed from the cart`);
  
        //update number of pokemons in cart
        let numOfPokemonsInCart = this.pokemonsInCartAmount.value;
        this.pokemonsInCartAmount.next(--numOfPokemonsInCart);

        if (this.logged) {
          this.logger.info(`a user is logged in. modifying pokemon cart in local storage`);
          //store the ids of pokemons added to cart and storage
          const pokemonsInCartIds = allPokemons.reduce((ids, pokemon) =>{
            if(pokemon.addedToCart === true){
                ids.push(pokemon.id);
            }
            return ids;
        }, []);
          localStorage.setItem('cartedPokemons',JSON.stringify(pokemonsInCartIds));
        }
      }
    }catch{
      this.logger.info(`error removing pokemon from cart`);
    }
  }

  /**
   * removes all pokemons from the cart
   */
  public clearAllPokemonsFromCart(): void {
    try{
      this.logger.info(`clearing pokemon cart`);
    //reset addedToCart property of pokemons in main list
    const allPokemons = this.pokemonList.value;
    //i think resetting all pokemons is faster than filtering out the names of pokemons which were in the cart and iterating over the whole list again to affect only them
    allPokemons.forEach(pok => pok.addedToCart = false);
    this.pokemonList.next(allPokemons);
    //reset pokemons in cart counter
    this.pokemonsInCartAmount.next(0);
    if (this.logged) {
      this.logger.info(`a user is logged in. removing all pokemons from local storage`);
      localStorage.removeItem('cartedPokemons');
    }
    }catch{
      this.logger.info(`error clearing pokemons from cart`);
    }
  }

  /**
   * loads saved pokemons cart from storage (if exists) when user logs in
   * @param logged boolean to indicate the status of the user
   */
  private loadPokemonsToCartFromLocalStorage(logged): void {
    try{
      if (logged) {
        this.logger.info(`a user just logged in. checking localStorage for saved pokemon cart`);
        const cartedPokemonsIds = localStorage.getItem('cartedPokemons');
        if (cartedPokemonsIds) {
          const allPokemons = this.pokemonList.value;
          const parsedCartedPokemonsIds = JSON.parse(cartedPokemonsIds);
          this.logger.info(`existing pokemons cart found`);
          
          //update pokemons in cart counter
          this.pokemonsInCartAmount.next(parsedCartedPokemonsIds.length);
          
          //mark pokemons added to cart
          parsedCartedPokemonsIds.forEach(cartedPokemonId => {
            const addedPokemonIndex = allPokemons.findIndex(pok => pok.id === cartedPokemonId);
            if( addedPokemonIndex !== -1){
              allPokemons[addedPokemonIndex].addedToCart = true;
            }
          });

          this.pokemonList.next(allPokemons);
        }
      }
    }catch{
      this.logger.info(`error loading pokemons cart from storage`);
    }
  }
}
