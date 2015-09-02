
var webpack = require("webpack");
var BowerWebpackPlugin = require('bower-webpack-plugin');



module.exports = {
	devtool : "source-map",
	entry : {
		main: './front/main.js',
		login: './front/login.js'
	},
	output: {
		path: 'public/js',
		filename: '[name].js'
	},
	resolve: {
		extensions: ['', '.coffee', '.js']
	},
	module: {
		loaders: [
			{test: /\.css$/, loader: 'style-loader!css-loader' },
			{test: /\.html$/, loader: 'html-loader'},
			{test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=819200'},
			{test: /\.jade/, loader: "jade" },
			{test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
			{test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
			{test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		]
	},
	plugins: [
		new BowerWebpackPlugin({
			modulesDirectories: ["bower_components"]
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		})
	]
};