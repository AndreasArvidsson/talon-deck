const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ESLintPlugin = require("eslint-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const path = require("path");
const glob = require("glob");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  const isDevserver = process.argv[2] === "serve";
  const filename = isProd ? "[contenthash]" : "[name]";
  const srcDir = path.resolve(__dirname, "src");
  const outDir = path.resolve(__dirname, "out");
  const backend = "http://localhost:3000";

  const server = {
    name: "server",
    entry: path.resolve(srcDir, "server/server.ts"),
    target: "node",
    output: {
      path: outDir,
      filename: `server.js`,
    },
    plugins: [new webpack.ContextReplacementPlugin(/express/)],
    externals: [nodeExternals()],
  };

  const client = {
    name: "client",
    entry: path.resolve(srcDir, "client/client.tsx"),
    output: {
      path: outDir,
      filename: `${filename}.js`,
      assetModuleFilename: `files/${filename}[ext]`,
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
      modules: [
        path.resolve(__dirname, "node_modules"),
        path.resolve(srcDir, "client"),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  [
                    "@babel/preset-react",
                    {
                      //Replaces the import source when importing functions.
                      //Remove for @babel/core 8
                      runtime: "automatic",
                    },
                  ],
                  "@babel/preset-typescript",
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            //Extract styles to .css file.
            MiniCssExtractPlugin.loader,
            "css-loader",
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|eot|woff|woff2|ttf|sh|pdf)$/,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      //Use index as template file.
      new HtmlWebPackPlugin({
        template: path.resolve(srcDir, "client/index.html"),
        // favicon: path.resolve(commonsWebDir, "images/favicon.ico"),
      }),

      //Extract css styles as external file.
      new MiniCssExtractPlugin({
        filename: `${filename}.css`,
      }),

      //Lint JS/TS files
      // new ESLintPlugin({
      //   overrideConfigFile: path.resolve(__dirname, lintConf),
      // }),
    ],
    devServer: {
      proxy: {
        "/temp": {
          target: `${backend}/`,
          changeOrigin: true,
        },
        "/rest/**": {
          target: `${backend}/`,
          changeOrigin: true,
        },
      },
    },
  };

  return [client, server];
};
