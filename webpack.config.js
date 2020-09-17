var path = require('path');
var SRC_DIR = path.join(__dirname, '/react-client/src');
var DIST_DIR = path.join(__dirname, '/react-client/dist');
const CompressionPlugin = require('compression-webpack-plugin');


module.exports = {
  entry: {
    'bundle.js': `${SRC_DIR}/entryCSR.jsx`
  },
  output: {
    filename: '[name]',
    path: DIST_DIR
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
    'jquery': 'jQuery'
  }
};
