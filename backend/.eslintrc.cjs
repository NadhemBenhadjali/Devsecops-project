module.exports = {
  env: { node: true, es2022: true },
  extends: ["standard"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  rules: {
    "no-console": "off",
    "quotes": "off",
    "semi": "off",
    "space-before-function-paren": "off",
    "comma-dangle": "off",
    "curly": "off",
    "no-trailing-spaces": "off",
    "no-multiple-empty-lines": "off"
  }
};
