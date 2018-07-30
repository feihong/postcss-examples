const path = require('path')
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

pagesDir = './pages/'

// Use all index.js files under pages/ as being entry points
const entries =
  glob.sync(pagesDir + '**/index.js')
    .reduce((acc, path_) => {
      let name = path.dirname(path_).substring(8)
      return {...acc, [name]: path_}
    }, {})

console.log('Entries:', entries)


module.exports = {
  mode: 'development',
  entry: entries,
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name]/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.pcss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          // {
          //   loader: 'style-loader'
          // },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]/bundle.css',
      chunkFilename: "[id].css"
    })
  ]
}
