const path                 = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin       = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode:    'development',
  entry:   {
    app:    ['./assets/css/app.scss'],
    editor: ['./assets/js/editor.jsx', './assets/css/editor.scss']
  },
  output:  {
    path:     path.resolve(__dirname, 'public/build'),
    filename: 'js/[name].[chunkhash].js',
    publicPath: '/build/',
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
    }),
    // new BundleAnalyzerPlugin()
  ]
};
