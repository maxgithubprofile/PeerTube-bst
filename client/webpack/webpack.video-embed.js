const helpers = require('./helpers')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ProvidePlugin = require('webpack/lib/ProvidePlugin')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const version = (Math.random() * 10000).toFixed(0)
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddCharsetWebpackPlugin = require("./addcharset");

module.exports = function () {
  const configuration = {
    entry: {
      'video-embed': './src/standalone/videos/embed.ts'
      /*'player': './src/standalone/player/player.ts',
      'test-embed': './src/standalone/videos/test-embed.ts'*/
    },

    resolve: {
      /*
       * An array of extensions that should be used to resolve modules.
       *
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: [ '.ts', '.js', '.json', '.scss' ],

      modules: [ helpers.root('src'), 'node_modules' ],

      symlinks: true,

      alias: {
        'video.js$': path.resolve('node_modules/video.js/core.js'),
        'hls.js$': path.resolve('node_modules/hls.js/dist/hls.light.js'),
        '@root-helpers': path.resolve('src/root-helpers'),
        '@shared/models': path.resolve('../shared/models'),
        '@shared/core-utils': path.resolve('../shared/core-utils'),
        process: "process/browser"
      },

      fallback: {
        fs: [ path.resolve('src/shims/noop.ts') ],
        http: [ path.resolve('src/shims/http.ts') ],
        https: [ path.resolve('src/shims/https.ts') ],
        path: [ path.resolve('src/shims/path.ts') ],
        stream: [ path.resolve('src/shims/stream.ts') ],
        crypto: [ path.resolve('src/shims/noop.ts') ]
      }
    },

    output: {
      // path: helpers.root('dist/standalone/videos'),
      //path: '/Users/aleksandr/dev-server/pocketnet/peertube',

      clean : {},

       path: 'C:\\inetpub\\wwwroot\\pocketnet\\peertube',

      filename: process.env.ANALYZE_BUNDLE === 'true'
        ? '[name].bundle.js'
        : '[name].bundle.js',

      sourceMapFilename: '[file].map',

      chunkFilename: process.env.ANALYZE_BUNDLE === 'true'
        ? '[name].chunk.js?v=' + version
        : '[name].chunk.js?v=' + version,

      publicPath: './peertube/'

    },

    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',

    module: {

      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                "presets": [
                  "@babel/preset-env"
                ],
                "plugins": ["@babel/plugin-proposal-async-generator-functions", "@babel/plugin-transform-spread", "@babel/plugin-transform-classes", "@babel/plugin-proposal-object-rest-spread", "@babel/plugin-transform-async-to-generator", "transform-es2015-constants"]
              }
            },
            {
              loader: 'ts-loader',
              options: {
                configFile: helpers.root('src/standalone/videos/tsconfig.json')
              }
            }
          ]
        },
        {
          test: /\.m?js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env'
                  ]
                ],

                plugins : ["@babel/plugin-transform-spread", "@babel/plugin-proposal-async-generator-functions", "@babel/plugin-transform-classes", "@babel/plugin-proposal-object-rest-spread", "@babel/plugin-transform-async-to-generator", "transform-es2015-constants"]
              }
            }
          ]
        },

        {
          test: /\.(sass|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,

            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1
              }
            },

            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  sourceMap: true,
                  includePaths: [
                    helpers.root('src/sass/include')
                  ]
                }
              }
            }
          ]
        },

        {
          test: /\.html$/,
          exclude: [
            helpers.root('src/index.html'),
            helpers.root('src/standalone/videos/embed.html'),
            helpers.root('src/standalone/videos/test-embed.html')
          ],
          type: 'asset/source'
        },

        {
          test: /\.(jpg|png|gif|svg)$/,
          type: 'asset'
        },

        {
          test: /\.(ttf|eot|woff2?)$/,
          type: 'asset'
        }
      ]

    },

    plugins: [
      //new BundleAnalyzerPlugin(),
      new ProvidePlugin({
        process: 'process/browser',
        Buffer: [ 'buffer', 'Buffer' ]
      }),

      new DefinePlugin({
        'process.env': JSON.stringify(process.env)
      }),

      new AddCharsetWebpackPlugin({
        charset: "utf-8"
      }),

      new MiniCssExtractPlugin({
        filename: process.env.ANALYZE_BUNDLE === 'true'
          ? '[name].css?v=' + version
          : '[name].css?v=' + version
      }),

      new HtmlWebpackPlugin({
        template: 'src/standalone/videos/embed.html',
        filename: 'embed.html',
        title: 'PeerTube',
        chunksSortMode: 'auto',
        inject: 'body',
        chunks: [ 'video-embed' ],
        minify: {
          collapseWhitespace: true,
          removeComments: false,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      }),

      new HtmlWebpackPlugin({
        template: '!!html-loader!src/standalone/videos/test-embed.html',
        filename: 'test-embed.html',
        title: 'PeerTube',
        chunksSortMode: 'auto',
        inject: 'body',
        chunks: [ 'test-embed' ]
      })
    ],

    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 6,
            warnings: false,
            ie8: false,
            safari10: true,
            mangle: true,
            compress: {
              passes: 3,
              pure_getters: true
            },
            output: {
              ascii_only: true,
              comments: false
            }
          }
        })
      ]
    },

    performance: {
      maxEntrypointSize: 700000, // 600kB
      maxAssetSize: 700000
    },

    node: {
      global: true
    }
  }

  return configuration
}
