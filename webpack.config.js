const path                 = require('path');
const webpack              = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin       = require('webpack-manifest-plugin');
const CleanObsoleteChunks  = require('webpack-clean-obsolete-chunks');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode:    'development',
  entry:   {
    app: ['./assets/css/app.scss']
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
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash].css'
    }),
    new ManifestPlugin({
      publicPath: 'build/'
    }),
    new CleanObsoleteChunks(),
    // new BundleAnalyzerPlugin()
  ]
};
