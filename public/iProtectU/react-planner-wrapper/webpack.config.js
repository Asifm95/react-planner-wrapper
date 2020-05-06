const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, self) => {
  let isProduction = self.hasOwnProperty('mode')
    ? self.mode === 'production'
    : true;
  let publicPath = self.hasOwnProperty('publicPath') ? self.publicPath : '/';
  let config = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(jpe?g|png|gif|mtl|obj)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                hash: 'sha512',
                digest: 'hex',
                name: '[path][name].[ext]',
                context: path.resolve(__dirname, 'src'),
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader/url' }, { loader: 'file-loader' }],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    devServer: {
      contentBase: path.join(__dirname, './dist'),
    },
    plugins: [],
  };

  if (!isProduction) {
    config.plugins.push(
      new HtmlWebpackPlugin({
        title: 'react-planner',
        template: './src/index.html.ejs',
        filename: 'index.html',
        inject: 'body',
        production: isProduction,
      })
    );
  }

  return config;
};
