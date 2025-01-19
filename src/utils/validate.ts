interface Props extends Value {
  name: string;
}
export function validateComponentName(value: Props): Status {
  const { mode, name, words } = value;

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
