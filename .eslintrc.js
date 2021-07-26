module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb-base"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "no-underscore-dangle": ["error", { "allow": ["_id"] }]
  },
};
