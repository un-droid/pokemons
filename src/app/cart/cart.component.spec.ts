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
  });
});
