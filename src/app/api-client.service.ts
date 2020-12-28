import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { forkJoin, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Pokemon, PokemonsResponse } from './pokemon-types';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private maxItems = 30;

  // API Docs: https://pokeapi.co/docs/v2#pokemon

  constructor(private logger: LoggerService, private httpClient: HttpClient) {
  }

  public getPokemons(): Observable<Pokemon[]>{
    this.logger.info(`fetching ${this.maxItems} pokemon names`);
    return this.httpClient.get<PokemonsResponse>(`https://pokeapi.co/api/v2/pokemon?limit=${this.maxItems}`).pipe(
        map(res => res.results),
        map((pokemons)=> {
           return pokemons.map(pokemon => this.getPokemonDataByName(pokemon.name).pipe(
                map(res => {
                  pokemon.image = res.sprites.front_default;
                  pokemon.id = res.id;
                  return pokemon;
                })
            )
          )
        }),
        // concatMap is used here to make sure that we fire the execution of the 
        // Observable created by forkJoin after the first get operation has returned
        concatMap(arrayOfObservables => forkJoin(arrayOfObservables))
      );
  }
  
  public getPokemonDataByName(pokemonName): Observable<any> {
    this.logger.info(`fetching ${pokemonName} data`);
    return this.httpClient.get<any>(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
  }

}
