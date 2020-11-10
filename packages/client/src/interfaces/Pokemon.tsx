export interface Pokemon {
    id: string
    name: string,
    types: string[],
    classification: string[],
    resistant: string[],
    weaknesses: string[],
    evolutions?: Evolution[],
    evolutionRequirements?: EvolutionRequirements,
    attacks: {
        fast: Attack[],
        special: Attack[]
    }
}

export interface Attack {
    name: string,
    type: string,
    damage: number
}

export interface EvolutionRequirements {
    amount: number,
    name: string
}

export interface Evolution {
    id: number,
    name: string
}

export interface PokemonFetch {
    data: Pokemon[],
    hasNext: boolean,
    lastCursor: string
}