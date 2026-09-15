/**
 * One counter for everything the document contains — nodes, components, variables,
 * resources, action steps. Keeping it in its own module lets `logic/` mint ids
 * without importing `factory/`, which imports the registry, which imports the
 * whole library.
 */
let counter = 0;

export const nextId = (): string => `n${(counter += 1)}`;

/** Restores the counter after loading a document so ids stay unique. */
export const seedIdCounter = (value: number): void => {
  counter = Math.max(counter, value);
};
