const CLIENT_STORAGE_INITIAL_VALUE: Value = {
  mode: "pascal",
  words: {
    primary: [],
    secondary: [],
    tertiary: [],
  },
};

export const createValue = (value: Partial<Value>): Value => {
  return {
    ...CLIENT_STORAGE_INITIAL_VALUE,
    ...value,
    words: {
      ...CLIENT_STORAGE_INITIAL_VALUE.words,
      ...(value.words ?? {}),
      primary: [
        ...CLIENT_STORAGE_INITIAL_VALUE.words.primary,
        ...(value.words?.primary ?? []),
      ],
      secondary: [
        ...CLIENT_STORAGE_INITIAL_VALUE.words.secondary,
        ...(value.words?.secondary ?? []),
      ],
      tertiary: [
        ...CLIENT_STORAGE_INITIAL_VALUE.words.tertiary,
        ...(value.words?.tertiary ?? []),
      ],
    },
  };
};

export const createWords = (value: string[]) => {
  return Array.from(new Set(value)).filter((t) => t !== "");
};
