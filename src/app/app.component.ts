import { Component, OnInit } from '@angular/core';
import { LoggerService } from './logger.service';
import { AuthService } from './auth.service';
import { PokemonService } from './pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'pokeshop';

  constructor(private logger: LoggerService, private auth: AuthService, private pokemonService: PokemonService) {    
  }

  ngOnInit(): void {
    this.logger.debug('init AppComponent');
    this.bootstrap();
  }

  private bootstrap() {
    this.auth.init();
    this.pokemonService.ngOnInit();
  }
}
