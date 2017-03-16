import babel from "rollup-plugin-babel";

export default {
  entry: "src/magicSandbox.js",
  format: "umd",
  moduleName: "magicSandbox",
  plugins: [
    babel({
      exclude: "node_modules/**"
    })
  ],
  dest: "magic-sandbox.js"
};
