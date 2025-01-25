export function splitComponentName(value: {
  mode: Mode;
  name: string;
}): string[] {
  const { mode, name } = value;
  let tokens: string[] = [];

  /**
   * nameをtokenごとに分割
   */
  switch (mode) {
    case "pascal":
    case "camel":
      tokens = name.split(/(?=[A-Z])/);
      break;
    case "train":
    case "kebab":
      tokens = name.split("-");
      break;

    case "dot":
      tokens = name.split(".");
      break;
    case "snake":
    case "studly":
    case "allcaps":
      tokens = name.split("_");
      break;
    default:
      break;
  }

  return tokens;
}

export function joinByMode(value: {
  mode: Mode;
  tokens: string[];
}) {
  const { mode, tokens } = value;
  let word = "";

  /**
   * nameをtokenごとに結合
   */
  switch (mode) {
    case "pascal":
    case "camel":
      word = tokens.join("");
      break;
    case "train":
    case "kebab":
      word = tokens.join("-");
      break;

    case "dot":
      word = tokens.join(".");
      break;
    case "snake":
    case "studly":
    case "allcaps":
      word = tokens.join("_");
      break;
    default:
      break;
  }

  return word;
}

export function createAllComponentNamePattern(value: {
  mode: Mode;
  words: {
    primary: string[];
    secondary: string[];
    tertiary: string[];
  };
}): string[] {
  const { mode, words } = value;

  const allPattern = words.primary.reduce<string[]>((arr, primaryWord) => {
    /**
     * 1. Patterns consisting of prefixes, root words, suffixes.
     */
    words.secondary.forEach((secondaryWord) => {
      words.tertiary.forEach((tertiaryWord) => {
        const word = joinByMode({
          mode,
          tokens: [primaryWord, secondaryWord, tertiaryWord],
        });
        arr.push(word);
      });
    });

    /**
     * 2. Patterns consisting of prefixes and suffixes.
     */
    words.tertiary.forEach((tertiaryWord) => {
      const word = joinByMode({
        mode,
        tokens: [primaryWord, tertiaryWord],
      });
      arr.push(word);
    });

    return arr;
  }, []);

  return allPattern;
}

export function validateComponentNameByMatchingAnyPatterns(value: {
  name: string;
  mode: Mode;
  words: {
    primary: string[];
    secondary: string[];
    tertiary: string[];
  };
}): Status {
  const { mode, name, words } = value;

  const allPattern = createAllComponentNamePattern({
    mode,
    words,
  });

  return allPattern.includes(name) ? "success" : "failure";
}

/**
 *
 * @summary You ought to use this method primarily for validating component names.
 * @returns
 */
export function validateComponentName(value: {
  name: string;
  mode: Mode;
  words: {
    primary: string[];
    secondary: string[];
    tertiary: string[];
  };
}): Status {
  return validateComponentNameByMatchingAnyPatterns(value);
}

/**
 * @deprecated This method cannot validate specific patterns that have prefixes and suffixes consisting of more than two words.
 *
 * Clearly known error modes
 * - Pascal Case
 * - Camel Case
 */
function _validateComponentNameBySplittingWords(value: {
  name: string;
  mode: Mode;
  words: {
    primary: string[];
    secondary: string[];
    tertiary: string[];
  };
}): Status {
  const { mode, name, words } = value;

  const tokens = splitComponentName({ mode, name });
  /**
   * tokenが3単語以上になっていないか判定
   */
  if (tokens.length > 3) {
    return "failure";
  }

  /**
   * 文体のチェック
   */
  switch (mode) {
    case "pascal": {
      const regex = new RegExp(/^[A-Z][a-z]+$/);
      const isFailure = tokens.some((token) => !regex.test(token));

      if (isFailure) {
        return "failure";
      }
      break;
    }
    case "camel": {
      const firstToken = tokens.shift() ?? "";
      const firstTokenRegex = new RegExp(/^[a-z]+$/);

      const isFailureToken = firstTokenRegex.test(firstToken) === false;

      if (isFailureToken) {
        return "failure";
      }

      const restTokensRegex = new RegExp(/^[A-Z][a-z]+$/);
      const isRestTokensFailure = tokens.some(
        (token) => !restTokensRegex.test(token),
      );

      if (isRestTokensFailure) {
        return "failure";
      }
      break;
    }
    case "train": {
      const regex = new RegExp(/^[A-Z][a-z]+$/);
      const isFailure = tokens.every((token) => regex.test(token));

      if (isFailure) {
        return "failure";
      }
      break;
    }
    case "kebab": {
      const regex = new RegExp(/^[a-z]+$/);
      const isFailure = tokens.every((token) => regex.test(token));

      if (isFailure) {
        return "failure";
      }
      break;
    }
    case "dot": {
      const regex = new RegExp(/^[a-zA-Z]+$/);
      const isFailure = tokens.every((token) => regex.test(token));

      if (isFailure) {
        return "failure";
      }
      break;
    }
    case "snake": {
      const regex = new RegExp(/^[a-z]+$/);
      const isFailure = tokens.every((token) => regex.test(token));

      if (isFailure) {
        return "failure";
      }
      break;
    }
    case "studly": {
      const regex = new RegExp(/^[A-Z][a-z]+$/);
      const isFailure = tokens.every((token) => regex.test(token));

      if (isFailure) {
        return "failure";
      }
      break;
    }
    case "allcaps": {
      const regex = new RegExp(/^[A-Z]+$/);
      const isFailure = tokens.every((token) => regex.test(token));

      if (isFailure) {
        return "failure";
      }
      break;
    }
    default:
      return "failure";
  }

  /**
   * 単語のチェック
   */
  if (words.primary.includes(tokens[0]) === false) {
    // console.log(words.primary, tokens[0], words.primary.includes(tokens[0]));
    return "failure";
  }
  if ([...words.secondary, ...words.tertiary].includes(tokens[1]) === false) {
    return "failure";
  }
  if (tokens[2] != null) {
    if (words.secondary.includes(tokens[2]) === false) {
      return "failure";
    }
  }

  return "success";
}
