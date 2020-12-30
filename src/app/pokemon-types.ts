export class PokemonsResponse {
    results: Pokemon[];
}

export class Pokemon {
    name: string;
    addedToCart: boolean = false;
    image: string;
    id: number;
}