module.exports = {
  extends: ["airbnb-base", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  rules: {
    "import/extensions": ["error", "never"],
    "max-len": ["error", { code: 120 }],
    "prettier/prettier": "error",
  },
};
