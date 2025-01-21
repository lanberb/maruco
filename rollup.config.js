import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "./src/main.ts",
    output: {
      file: "./main.js",
      format: "esm",
    },
    plugins: [typescript()],
  },
];
