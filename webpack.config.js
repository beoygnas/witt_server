const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    extensions: ['.mjs', '.json', '.ts'],
    symlinks: false,
    cacheWithContext: false,
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  stats: 'minimal',
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: [],
    }),
    'aws-sdk',
  ],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: [[path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, '.serverless'), path.resolve(__dirname, '.webpack')]],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
  //   plugins: [
  //     new ForkTsCheckerWebpackPlugin({
  //       eslint: true,
  //       eslintOptions: {
  //         cache: true,
  //       },
  //     }),
  //   ]
};
