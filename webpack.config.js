// webpack.config.js
const path = require("path");
const glob = require("glob");

module.exports = {
  mode: "production", // or "development" for non-minified output
  entry: glob.sync("./src/js/**/*.js").reduce((acc, filePath) => {
    const entryName = path.relative("./src/js", filePath).replace(/\.js$/, '');
    acc[entryName] = path.resolve(__dirname, filePath);
    return acc;
  }, {}),
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist/js"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};