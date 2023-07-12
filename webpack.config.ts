import path from 'path';

import { config as configDotEnv } from 'dotenv';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import 'webpack-dev-server';

import { Configuration, ProgressPlugin, DefinePlugin, ProvidePlugin } from 'webpack';
const dotenv = configDotEnv();

///////////////////////////////////////////
// Establish patterns for the copy plugin
///////////////////////////////////////////
const copyPluginPatterns = [
  {
    from: 'src/assets',
    noErrorOnMissing: true,
    globOptions: {
      // Match everything but l10n, and image assets
      ignore: ['**/locales/*.json', '**/*.gif', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg'],
    },
  },
];

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;

  const config: Configuration = {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'js/[name].[contenthash].js',
      publicPath: '/',
      clean: true,
    },
    stats: {
      errorDetails: true,
    },
    devtool: isDevelopment && 'eval-source-map', // https://webpack.js.org/configuration/devtool/
    devServer: {
      hot: true,
      compress: true,
      static: {
        directory: path.join(__dirname, 'src/assets'),
      },
      port: 3000,
      historyApiFallback: { index: '/', disableDotRule: true },
      client: {
        progress: false,
        overlay: {
          errors: true,
          warnings: false,
        },
        reconnect: true,
      },
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    module: {
      exprContextCritical: false,
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
          },
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(gif|jpg|jpeg|png|svg)$/,
          loader: 'file-loader',
          options: {
            name: 'media/[name].[hash].[ext]',
          },
        },
        {
          test: [/\.s?css$/],
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: copyPluginPatterns,
        options: {
          concurrency: 100,
        },
      }),
      new HtmlPlugin({
        template: 'index.html',
        templateParameters: {
          APP_BUILD_NUMBER: process.env.REACT_APP_BUILD_NUMBER,
          APP_BUILD_TIME: process.env.REACT_APP_BUILD_TIME,
          APP_BUILD_DATE: process.env.REACT_APP_BUILD_DATE,
          APP_VERSION: process.env.REACT_APP_VERSION,
        },
      }),
      new ProvidePlugin({ process: 'process' }),
      new DefinePlugin({
        'process.env': `(${JSON.stringify(dotenv.parsed)})`,
      }),
      (isDevelopment && new ReactRefreshPlugin()) as ReactRefreshPlugin,
      new ProgressPlugin(),
    ].filter(Boolean),
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module, chunks, cacheGroupKey) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `${cacheGroupKey}.${packageName.replace('@', '')}`;
            },
          },
          common: {
            minChunks: 2,
            priority: -10,
          },
        },
      },
      runtimeChunk: 'single',
    },
  };

  return config;
};
