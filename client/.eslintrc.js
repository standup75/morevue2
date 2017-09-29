module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  'env': {
    'browser': true,
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'func-names': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'semi': 0,
    'one-var': 0,
    'one-var-declaration-per-line': 0,
    'space-before-function-paren': 0,
    'no-underscore-dangle': 0,
    'no-use-before-define': 0,
    'no-plusplus': 0
  }
}
