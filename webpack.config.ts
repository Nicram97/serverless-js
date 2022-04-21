/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from 'path';
import * as wp from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
const slsw = require('serverless-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const lazyImports = [
  '@nestjs/microservices',
  // ADD THIS
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets',
  // AND THIS
  '@nestjs/websockets/socket-module',
  '@nestjs/platform-express',
  'cache-manager',
  'class-validator',
  'class-transformer',
];

const config: wp.Configuration = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: slsw.lib.webpack.isLocal ? "source-map" : false,
  target: 'node',
  stats: 'minimal',
  externals: [],
  entry: Object.keys(slsw.lib.entries).reduce(
    (entries: { [x: string]: any }, key) => {
      entries[key] = ['./source-map-install.js', slsw.lib.entries[key]];
      return entries;
    },
    {},
  ),
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin({ configFile: 'tsconfig.build.json' })],
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new wp.IgnorePlugin({
      checkResource(resource) {
        if (lazyImports.includes(resource)) {
          try {
            require.resolve(resource);
          } catch (err) {
            return true;
          }
        }
        return false;
      },
    })
  ],
}

export default config;