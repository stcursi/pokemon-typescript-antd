import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { identity } from "fp-ts/lib/function";
import { data } from "../data/pokemons";
import { toConnection, slice } from "../functions";
import { Connection } from "../types";

interface Pokemon {
  id: string;
  name: string;
  types: string[];
  classification: string;
  resistant: string[];
  weaknesses: string[];
}

const SIZE = 10;

export function query(args: {
  after?: string;
  limit?: number;
  q?: string;
}): Connection<Pokemon> {
  const { after, q, limit = SIZE } = args;

  console.log('q : ', q);

  const filterByQ: (as: Pokemon[]) => Pokemon[] =
    // filter only if q is defined
    q === undefined
      ? identity
      : A.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  const sliceByAfter: (as: Pokemon[]) => Pokemon[] =
    // filter only if q is defined
    after === undefined
      ? identity
      : as =>
        pipe(
          as,
          A.findIndex(a => a.id === after),
          O.map(a => a + 1),
          O.fold(() => as, idx => as.slice(idx))
        );

  const results: Pokemon[] = pipe(
    data,
    filterByQ,
    sliceByAfter,
    // slicing limit + 1 because the `toConnection` function should known the connection size to determine if there are more results
    slice(0, limit + 1)
  );
  return toConnection(results, limit);
}

export function byTypeQuery(args: {
  after?: string;
  limit?: number;
  type?: string;
}): Connection<Pokemon> {
  const { after, type, limit = SIZE } = args;

  console.log('After limit q ', limit);
  console.log('Type : ', type);

  const arrayOfTypes: string[] = type ? type.split(',') : [];

  let invalidEntries = 0;

  const filterByType: (as: Pokemon[]) => Pokemon[] =
    // filter only if q is defined
    type === undefined
      ? identity
      : A.filter(p => {

        for (let pType of p.types) {
          if (arrayOfTypes.indexOf(pType) !== -1) {
            return true;
          }
        }

        invalidEntries++;
        return false;

      }
      );

  const sliceByAfter: (as: Pokemon[]) => Pokemon[] =
    // filter only if q is defined
    after === undefined
      ? identity
      : as =>
        pipe(
          as,
          A.findIndex(a => a.id === after),
          O.map(a => a + 1),
          O.fold(() => as, idx => as.slice(idx))
        );

  const results: Pokemon[] = pipe(
    data,
    filterByType,
    sliceByAfter,
    // slicing limit + 1 because the `toConnection` function should known the connection size to determine if there are more results
    slice(0, limit + 1)
  );

  console.log('results: ', results);
  return toConnection(results, limit);
}
