export class PokemonsResponse {
    results: Pokemon[];
}

export class Pokemon {
    name: string;
    addedToCart: boolean = false;
    image: string;
    id: number;

    constructor(name, inCart, image, id){
        this.name = name;
        this.addedToCart = inCart;
        this.image = image;
        this.id = id;
    }
}