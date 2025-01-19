/**
 * Mode Examples
 * - PascalCase (=UpperCamelCase)
 * - camelCase (=LowerCamelCase)
 * - Train-Case (=UpperKebabCase)
 * - kebab-case (=LowerKebabCase)
 * - dot.case
 * - snake_case
 * - Studly_Case
 * - ALL_CAPS
 */
declare type Mode =
  | "pascal"
  | "camel"
  | "train"
  | "kebab"
  | "dot"
  | "snake"
  | "studly"
  | "allcaps";

declare type Status = "pending" | "success" | "failure";

/**
 * figma.clientStorage.setAsyncで保持するstate
 */
declare interface Value {
  mode: Mode;
  words: {
    primary: string[];
    secondary: string[];
    tertiary: string[];
  };
}
