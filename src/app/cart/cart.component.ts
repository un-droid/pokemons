import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggerService } from '../logger.service';
import { Pokemon } from '../pokemon-types';
import { PokemonService } from '../pokemon.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent, ConfirmDialogModel } from "../confirm/confirm.component";
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade out when destroyed
      transition(':leave',
        animate(400, style({opacity: 0})))
    ])
  ]
})
export class CartComponent implements OnInit {

  pokemons:Pokemon[] = [];
  private pokemonsSub = new Subscription();
  clearCartDialogResult: string = '';
  
  pokemonsInCartCount:number = 0;
  private pokemonsInCartNumSub = new Subscription();

  constructor(private pokemonService: PokemonService, 
              private logger: LoggerService,
              private dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.pokemonsSub.unsubscribe();
    this.pokemonsInCartNumSub.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.debug('init CartComponent');
    this.pokemonsSub = this.pokemonService.PokemonList$.subscribe(result => this.pokemons = result);
    this.pokemonsInCartNumSub = this.pokemonService.PokemonsInCartAmount$.subscribe(result => this.pokemonsInCartCount = result);
  }

  /**
   * function which removes a pokemon from the cart by calling the service which sets the addedToCart prop tp false
   * @param pokemon the pokemon to be removed from the cart
   */
  removePokemonFromCart(pokemon): void{
    this.pokemonService.removePokemonFromCart(pokemon);
  }

  /**
   * a custom confirmation dialog to clear the cart
   */
  clearCart(): void {
    const message = `Are you sure you want to clear the cart?`;
 
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
 
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: "400px",
      data: dialogData
    });
 
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.clearCartDialogResult = dialogResult;
      if(dialogResult === true){
        this.pokemonService.clearAllPokemonsFromCart();
      }
    });
  }

  /**
   * function to help speed things up during ngfor rendering
   * @param pokemon an object which has a trackable parameter, id in this case
   */
  public trackByFn(pokemon) {
    return pokemon.id;
  }

  /**
   * function that performs filtering by the addedToCart parameter
   * @param poks is a list of all pokemons
   */
  public performFilter(poks:Pokemon[]): Pokemon[] {
    return poks.filter((pokemon: Pokemon) => pokemon.addedToCart === true );
  }
}