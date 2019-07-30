import buble from 'rollup-plugin-buble';

module.exports = {
  plugins: [ buble() ],
  input: 'src/magicSandbox.js',
  output: {
    name: 'magicSandbox',
    file: 'magic-sandbox.js',
    format: 'umd'
  }
};
