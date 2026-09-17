/**
 * `cn` and the numeral helpers, imported from the library's own modules rather
 * than through its barrel.
 *
 * `@nili/ui` re-exports the providers, and those call `createContext` when
 * their module is evaluated — which React's server build refuses. A Server
 * Component therefore cannot touch the barrel at all, even to reach a pure
 * function beside it. Deep-importing the leaf module is the only way in, and
 * these two lines are the whole surface of that exception: everything that is
 * actually a component still comes through `@www/components/nili`.
 */
export { cn } from '@nili/ui/lib/cn';
