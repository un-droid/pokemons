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

  pokemonsInCart:Pokemon[] = [];
  private cartPokemonsSub = new Subscription();
  showPokemon = true;
  result: string = '';
  constructor(private pokemonService: PokemonService, 
              private logger: LoggerService,
              private dialog: MatDialog) { }

  toggle(){
    this.showPokemon = !this.showPokemon;
  }
  ngOnDestroy(): void {
    this.cartPokemonsSub.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.debug('init CartComponent');
    this.cartPokemonsSub = this.pokemonService.pokemonsInCartList$.subscribe(result => this.pokemonsInCart = result);
  }

  removePokemonFromCart(pokemon): void{
    this.pokemonService.removePokemonFromCart(pokemon);
  }

  clearCart(): void {
    const message = `Are you sure you want to clear the cart?`;
 
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
 
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: "400px",
      data: dialogData
    });
 
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if(dialogResult === true){
        this.pokemonService.clearAllPokemonsFromCart();
      }
    });
  }

  public trackByFn(pokemon) {
    return pokemon.id;
  }
}