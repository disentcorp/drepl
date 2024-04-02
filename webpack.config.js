const path = require('path');

module.exports = [
  {
    mode: 'production',
    entry: './src/lib/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      library: 'drepl',
      libraryTarget: 'umd',
      globalObject: 'this',
      publicPath: '/dist/',
      umdNamedDefine:true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
      ],
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
    },
    
  },
];
