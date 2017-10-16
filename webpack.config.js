const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    watch: true,
    entry: './app.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    externals: {
        'alight': 'alight',
        'THREE': 'THREE',
        'D3NE': 'D3NE',
        'Texturity': 'Texturity'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: []
                    }
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: './logo.svg'
            }, {
                from: './models',
                to: 'models'
            }, {
                from: './envMap',
                to: 'envMap'
            }
        ]),
        new HtmlWebpackPlugin({inject: 'head', title: 'allmatter - 3D material authoring tool', template: 'index.html'})
    ]
}