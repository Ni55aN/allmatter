const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {

    return {
        entry: {
            three: [
                'three', 'three-orbit-controls', 'three-obj-loader'
            ],
            vue: [
                'vue', 'vuex'
            ],
            app: './src/app.js',
            d3ne: 'd3-node-editor'
        },
        resolve: {
            alias: {
                vue: 'vue/dist/vue.esm.js'
            }
        },
        devServer: {
            contentBase: './dist'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
        },
        externals: {
            'Texturity': 'Texturity',
            'D3NE': 'D3NE'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }, {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }

                }, {
                    test: /\.svg$/,
                    loader: 'file-loader'
                }, {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                }, {
                    test: /\.s[a|c]ss$/,
                    loader: 'style!css!sass'
                }
            ]
        },
        devtool: '#inline-source-map',
        plugins: [
            new webpack
                .optimize
                .CommonsChunkPlugin({
                    names: ['three', 'vue', 'd3ne']
                }),

            new CopyWebpackPlugin([
                {
                    from: './models',
                    to: 'models'
                }, {
                    from: './envMap',
                    to: 'envMap'
                }, {
                    from: './style',
                    to: 'style'
                }
            ]),
            new HtmlWebpackPlugin({inject: 'body', title: 'allmatter - 3D material authoring tool', template: 'index.html'})
        ]
    }
}