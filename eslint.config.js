// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "backend/*", "scripts/*", ".storybook/*", "admin/*"],
    rules: {
      "max-lines": ["warn", { "max": 200, "skipBlankLines": true, "skipComments": true }],
      "import/namespace": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/immutability": "off",
      "react-hooks/use-memo": "off",
      "no-restricted-imports": ["error", {
        "patterns": [{
          "group": ["**/components/ui/*", "**/components/workout/*", "**/components/auth/*", "**/components/common/*", "**/components/paywall/*"],
          "message": "Por favor, utilize a importação centralizada a partir de '../src/components'."
        }]
      }]
    }
  },
  {
    files: ["**/*.test.js", "**/__tests__/**/*.js", "**/__mocks__/**/*.js", "jest.setup.js"],
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly"
      }
    },
    rules: {
      "react/display-name": "off",
      "no-restricted-imports": "off"
    }
  },
  {
    files: ["backend/**/*.js"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        console: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly"
      }
    }
  }
]);

