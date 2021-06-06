const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    target: "web",
    mode: "development",
    devtool: "inline-source-map",
    // Optional for webpack-dev-server
    devServer: {
        watchContentBase: true,
        contentBase: path.resolve(__dirname, "../dist"),
        open: true,
        hot: true,
    },
});
