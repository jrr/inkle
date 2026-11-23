import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";

export default [
  {
    ignores: [
      ".yarn/plugins",
      ".yarn/releases",
      ".yarn/sdks",
      "**/*.js",
      "**/.pnp.*",
      "**/dist",
    ],
  },
  js.configs.recommended,
  ...typescriptEslint.configs["flat/recommended"],
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
