const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/main.tsx", // Entry point
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "assets/[name].[contenthash].js" : "assets/[name].js",
      publicPath: "/", // Important for React Router
      assetModuleFilename: "assets/images/[hash][ext][query]",
    },
    devtool: isProduction ? "source-map" : "cheap-module-source-map",
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      alias: {
        "@": path.resolve(__dirname, "src"), // Matches tsconfig paths
        "process/browser": require.resolve("process/browser"),
      },
      fallback: {
        // Polyfills if needed for older node packages in browser
        buffer: require.resolve("buffer/"),
        process: require.resolve("process/browser"),
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                plugins: [!isProduction && require.resolve("react-refresh/babel")].filter(Boolean),
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "postcss-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/qasa.ico",
      }),
      new Dotenv({
        systemvars: true, // Load system env vars (useful for CI/CD)
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "public",
            to: "",
            globOptions: {
              ignore: ["**/index.html"], // HTML is handled by HtmlWebpackPlugin
            }
          },
        ],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
        Buffer: ['buffer', 'Buffer'],
      }),
      new MiniCssExtractPlugin({
        filename: 'assets/[name].[contenthash].css',
      }),
      // PWA Support - Replaces VitePWA
      new InjectManifest({
        swSrc: "./src/sw.ts",
        swDest: "sw.js",
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      }),
      !isProduction && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
      runtimeChunk: "single",
    },
    devServer: {
      historyApiFallback: true, // Fix for React Router 404s on refresh
      port: 5173, // Keeping the same port as Vite for convenience
      hot: true,
      open: true,
      proxy: [
        {
          context: ["/api"],
          target: "http://localhost:3005", // Matches your server/index.ts
          changeOrigin: true,
          secure: false,
        },
      ],
    },
  };
};
