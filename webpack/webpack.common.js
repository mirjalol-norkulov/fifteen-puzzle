const PrettierPlugin = require("prettier-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: { index: "./src/index.js", v2: "./src/v2.js" },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|mp3)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src/"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      filename: "v2.html",
      template: "./src/v2.html",
      chunks: ["v2"],
    }),
    new PrettierPlugin(),
  ],
};
