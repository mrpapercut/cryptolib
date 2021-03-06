const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        CryptoLib: './lib/CryptoLib'
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            include: [path.resolve(__dirname, 'lib')],
            query: {
                presets: ['env']
            }
        }]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        /*new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            filename: 'commons.js',
            name: 'commons'
        })*/
    ]
}
