const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./visapp/app.js",
    output: {
        path: __dirname,
        filename: "visapp_bundle.js"
    },
    resolveLoader: { root: path.join(__dirname, "node_modules") }
};
