module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    "parser": "babel-eslint",
    "parserOptions": {
      "sourceType": "module",
      "allowImportExportEverywhere": true
    }
  },
  'rules': {
    "indent": ["error", 4],
    "require-jsdoc": 0,
    "max-len": ["error", {"code": 120}]
  },
};
