var path = require('path');
var SRC_DIR = path.join(__dirname, '/react-client/src');
const CompressionPlugin = require('compression-webpack-plugin');


module.exports = {
  entry: {
    'react-client/dist/bundle.js': `${SRC_DIR}/entryCSR.jsx`,
    'react-client/templates/bundle.js': `${SRC_DIR}/entrySSR.jsx`
  },
  output: {
    filename: '[name]',
    path: __dirname
  },
  plugins: [
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$/,
      threshold: 5000,
    }),
  ],
  module : {
    rules : [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel-loader',
        options: {
          presets: ['@babel/react']
        }
      }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom' : 'ReactDOM',
    'axios': 'axios',
    'jquery': 'jQuery'
  }
};
