console.log('I am webpack.');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { lstatSync, readdirSync } = require('fs');
const source = path.resolve(__dirname, 'src/components');
const isDirectory = source => lstatSync(source).isDirectory();
const dirs = readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const debug = process.env.NODE_ENV !== "production";
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
	entry: {
	    app: [
	        './src/app.js',
	        './src/app.scss'
	    ],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "bundle.js"
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/
                ],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                },
            },
            {
                test: /\.hbs$/,
                use: [{
                    loader: 'handlebars-loader',
                    options: {
                        partialDirs: [path.resolve(__dirname, 'src/'), ...dirs],
                        helperDirs: path.join(__dirname, 'bin/helpers'),
                    }
                }]
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                 test: /\.(woff|woff2|ttf)(\?[a-z0-9=.]+)?$/,
                 use: [
                     'file-loader'
                 ]
            }
       ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            { from: './src/assets/img', to: './assets/img' },
            { from: './src/assets/data', to: './assets/data' },
        ]),
        new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.hbs'),
            title: 'Seasonal veg',
            // templateParameters: require('./src/portfolio-config.json'),
            config: require('./src/config.json')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ]
};
