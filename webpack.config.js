const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {

    return {
        entry: {
            splash: './src/splash.js',
            three: [
                'three', 'three-orbit-controls', 'three-obj-loader'
            ],
            vue: [
                'vue', 'vuex'
            ],
            d3ne: ['d3-node-editor'],
            texturity: ['texturity.js'],
            app: './src/app.js'
        },
        resolve: {
            alias: {
                vue: 'vue/dist/vue.esm.js'
            }
        },
        devServer: {
            contentBase: './dist',
            hot: true
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }, {
                    test: /\.(sass|scss)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
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
                    test: /\.js$/,
                    use: ['source-map-loader'],
                    enforce: 'pre'
                }
            ]
        },
        devtool: 'source-map',
        plugins: [
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack
                .optimize
                .CommonsChunkPlugin({
                    names: ['three', 'vue', 'd3ne', 'texturity', 'splash']
                }),
            new webpack
                .optimize
                .CommonsChunkPlugin({name: 'common'}),
            new webpack.ProvidePlugin({
                'D3NE': 'd3-node-editor'
            }),
            new CopyWebpackPlugin([
                {
                    from: './assets',
                    to: 'assets'
                }
            ]),
            new HtmlWebpackPlugin({
                inject: 'body',
                title: 'allmatter - 3D material authoring tool',
                template: 'index.html',
                excludeChunks: ['splash', 'common']
            })
        ]
    }
}