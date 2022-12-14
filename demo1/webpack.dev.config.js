const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const { ModuleFederationPlugin } = require('webpack').container
const cwd = process.cwd()

module.exports = {
  mode: 'development',

  entry: {
    origin: path.join(__dirname, './src/app.tsx'),
  },

  output: {
    path: path.resolve(__dirname, 'build/'),
    publicPath: 'auto',
  },

  stats: 'normal',

  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  devServer: {
    port: 10010,
    host: 'localhost',
    hot: false,
    webSocketServer: false,
    open: true,
    historyApiFallback: true,
    allowedHosts: '*',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  module: {
    rules: [
      {
        test: /\.js|\.ts|\.tsx$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        options: {
          presets: [
            require.resolve('@babel/preset-env'),
            [
              '@babel/preset-typescript',
              {
                isTSX: true,
                jsxPragma: 'React',
                allExtensions: true,
                allowNamespaces: true,
              },
            ],
            require.resolve('@babel/preset-react'),
          ],
        },
      },
      {
        test: /\.md$/,
        loader: require.resolve('raw-loader'),
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          require.resolve('css-loader'),
          require.resolve('less-loader'),
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: () => {
                  autoprefixer({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    browsers: ['last 2 version', '>1%'],
                  })
                },
              },
            },
          },
        ],
      },
    ],
  },

  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
  },

  plugins: [
    // ?????????css
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash].css',
      chunkFilename: '[id]_[contenthash]',
    }),

    new htmlWebpackPlugin({
      title: 'api-ui',
      template: path.join(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
  ],
}
