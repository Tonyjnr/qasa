module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }], // Enables JSX without importing React
    "@babel/preset-typescript",
  ],
};
