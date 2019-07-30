const path                 = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin       = require('webpack-manifest-plugin');

module.exports = {
  mode:    'development',
  entry:   {
    app: ['./assets/js/index.jsx', './assets/css/app.scss']
  },
  output:  {
    path:     path.resolve(__dirname, 'public/build'),
    filename: 'js/[name].[chunkhash].js'
  },
  devtool: 'source-map',
  module:  {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        resolve: {
          extensions: [".js", ".jsx"]
        },
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use:  [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash].css'
    }),
    new ManifestPlugin({
      publicPath: 'build/'
    })
  ]
};
