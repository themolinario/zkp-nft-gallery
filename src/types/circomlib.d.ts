// Dichiarazione di tipi per circomlib
declare module 'circomlib' {
  export function poseidon(inputs: (string | number | bigint)[]): bigint;
  export const poseidon: {
    (inputs: (string | number | bigint)[]): bigint;
  };
}

