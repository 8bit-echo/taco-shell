const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BrowserSync = require('browser-sync-webpack-plugin');

/**
 * gets all the files in /src/js and maps them to their own entry objects for code splitting purposes.
 */
function getEntryPoints() {
  const entryPoints = {};
  const sources = ['src/js/'];

  for (let i = 0; i < sources.length; i++) {
    const sourcePath = sources[i];
    const fullSrcPath = path.join(__dirname, '/_/', sourcePath);

    const files = fs.readdirSync(fullSrcPath);
    files.forEach(file => {
      if (file[0] === '.') {
        return;
      }
      const stat = fs.statSync(fullSrcPath + file);
      if (stat.isFile()) {
        if (file.substr(0, 1) !== '_') {
          const baseName = path.basename(file, path.extname(file));
          entryPoints[baseName] = './_/' + sourcePath + file;
        }
      }
    });
  }
  console.log(entryPoints.global);
  return entryPoints;
}

const config = {
  entry: getEntryPoints,
  output: {
    filename: './js/[name].js',
    path: path.resolve(__dirname, '_/dist/'),
    publicPath: '/_/dist/'
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        // needs to be imported in js file.
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                // sourceMap: process.env.NODE_ENV !== 'production'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                // sourceMap: process.env.NODE_ENV !== 'production'
              }
            },
            {
              loader: 'sass-loader',
              options: {
                // for making global.scss available in all files.
                // data: '@import global',
                // includePaths: [path.resolve(__dirname, './_src/scss/')],
                // sourceMap: process.env.NODE_ENV !== 'production'
              }
            }
          ]
        })
      },

      {
        test: /\.js$/,
        // supports writing in es 6, 2017 styles.
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            [
              'env',
              {
                targets: {
                  browsers: ['last 2 versions', 'IE >= 11']
                }
              }
            ]
          ]
        }
      },

      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: ['vue-style-loader', 'css-loader', 'sass-loader']
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[ext]'
        }
      },

      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'font/[name].[ext]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  // Source maps with line numbers only
  devtool: '#cheap-eval-source-map',

  plugins: [
    // this is for postcss-loader
    require('autoprefixer'),

    // required for scss -> css compilation
    new ExtractTextPlugin({ filename: '/css/[name].css?[hash]', allChunks: false, publicPath: '../' }),
    // register jquery globally.
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery'
    }),
    // live reload of webpages on change.
    new BrowserSync({
      port: 3000,
      files: ['**/*.php'],
      injectChanges: true,
      reloadDelay: 0,
      notify: false,
      logSnippet: false,
      https: true
    })
    // copy any other static assets
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '_/src/static'),
    //     to: path.resolve(__dirname, '_/dist/static/'),
    //     ignore: ['.*']
    //   }
    // ])
  ]
};

// Change options for Production
if (process.env.NODE_ENV === 'production') {
  console.log('> Building for production...');
  config.plugins.push(
    // js minification
    new MinifyPlugin(),
    // css minification
    new OptimizeCssAssetsPlugin(),
    // vue production mode
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  );
  // source maps
  delete config.devtool;
}

module.exports = config;
