import { Pokemon, PokemonFetch } from "../interfaces/Pokemon";
import React from "react";
import { Tag } from "antd";

export function pokemonParser(data: any, query: string) {

    const dataParsed: Pokemon[] = [];
    const toReturn: PokemonFetch = {
        hasNext: false,
        lastCursor: "",
        data: []
    };

    if (data && data[query] && data[query].edges) {

        if (data[query].pageInfo && data[query].pageInfo) {
            toReturn.hasNext = data[query].pageInfo.hasNextPage;
            toReturn.lastCursor = data[query].pageInfo.endCursor
        }

        data[query].edges.map((edge: any) => {

            if (edge.node) {

                const pk: Pokemon = {
                    id: edge.node.id,
                    name: edge.node.name,
                    classification: edge.node.classification,
                    types: edge.node.types,
                    resistant: edge.node.resistant,
                    weaknesses: edge.node.weaknesses,
                    evolutions: edge.node.evolutions,
                    evolutionRequirements: edge.node.evolutionRequirements,
                    attacks: edge.node.attacks
                }

                dataParsed.push(pk);
            }

        })

        toReturn.data = dataParsed;
    }

    return toReturn;

}


export function getPokemonTag(type: string) {

    switch (type) {
        case 'Ground':
        case 'Grass':
            return <Tag color="green">{type}</Tag>
        case 'Ghost':
        case 'Poison':
            return <Tag color="purple">{type}</Tag>
        case 'Fire':
            return <Tag color="volcano">{type}</Tag>
        case 'Dark':
        case 'Fighting':
            return <Tag color="black">{type}</Tag>
        case 'Flying':
        case 'Fairy':
            return <Tag color="magenta">{type}</Tag>
        case 'Psychic':
        case 'Electric':
            return <Tag color="gold">{type}</Tag>
        case 'Water':
            return <Tag color="geekblue">{type}</Tag>
        case 'Steel':
            return <Tag color="grey">{type}</Tag>
        case 'Bug':
            return <Tag color="lime">{type}</Tag>
        case 'Ice':
            return <Tag color="cyan">{type}</Tag>
        case 'Rock':
        case 'Normal':
            return <Tag color="brown">{type}</Tag>
        default:
            return ""
    }
}

export const pokemonTypes: any[] = [
    {
        text: 'Grass',
        value: 'Grass',
    },
    {
        text: 'Poison',
        value: 'Poison',
    },
    {
        text: 'Fire',
        value: 'Fire',
    },
    {
        text: 'Water',
        value: 'Water',
    },
    {
        text: 'Fighting',
        value: 'Fighting',
    },
    {
        text: 'Fairy',
        value: 'Fairy',
    },
    {
        text: 'Electric',
        value: 'Electric',
    },
    {
        text: 'Steel',
        value: 'Steel',
    },
    {
        text: 'Bug',
        value: 'Bug',
    },
    {
        text: 'Ice',
        value: 'Ice',
    },
    {
        text: 'Normal',
        value: 'Normal',
    },
    {
        text: 'Psychic',
        value: 'Psychic',
    },
    {
        text: 'Ground',
        value: 'Ground',
    },
    {
        text: 'Flying',
        value: 'Flying',
    },
    {
        text: 'Ghost',
        value: 'Ghost',
    },
    {
        text: 'Rock',
        value: 'Rock',
    },
    {
        text: 'Dark',
        value: 'Dark',
    }
]