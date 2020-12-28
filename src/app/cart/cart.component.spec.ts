import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatList, MatListItem } from '@angular/material/list';
import { ConfirmComponent, ConfirmDialogModel } from '../confirm/confirm.component';
import { Pokemon } from '../pokemon-types';

import { CartComponent } from './cart.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartComponent,  MatListItem, ConfirmComponent, ConfirmDialogModel, MatList ],
      imports: [MatDialog],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change pokemons count in cart when a pokemon is added and removed', () => {
    const fixture = TestBed.createComponent(CartComponent);
    const component = fixture.componentInstance;
    const pokemonForTest = new Pokemon("testPokemon", false, "imageUrl", 1);
    expect(component.pokemonsInCart.length).toBe(0, 'empty at first');
    component.pokemonsInCart.push(pokemonForTest);
    expect(component.pokemonsInCart.length).toBe(1, "after 1 pokemon has been added to cart");
    component.removePokemonFromCart(pokemonForTest);
    expect(component.pokemonsInCart.length).toBe(0, 'after 1 pokemon has been removed from cart');
  });
});
