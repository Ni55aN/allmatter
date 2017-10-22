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
            app: './src/app.js'
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
                }
            ]
        },
        devtool: '#inline-source-map',
        plugins: [
            new webpack
                .optimize
                .CommonsChunkPlugin({
                    names: ['three', 'vue', 'splash']
                }),
            new webpack
                .optimize
                .CommonsChunkPlugin({name: 'common'}),

            new CopyWebpackPlugin([
                {
                    from: './models',
                    to: 'models'
                }, {
                    from: './envMap',
                    to: 'envMap'
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