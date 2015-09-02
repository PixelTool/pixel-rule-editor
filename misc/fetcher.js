/**
 * Created on 6/9/15.
 */

var env = require('jsdom').env;
var $ = require('jquery');
var jsdom = require('jsdom');
var fs = require('fs');
var jquery = fs.readFileSync(__dirname + '/../node_modules/jquery/dist/jquery.min.js', 'utf-8');


var fetcher = function (url, callback) {

	if (url === null || url === undefined || typeof url !== 'string') {

		callback(null, new Error('Unexpected `url` type.'));
		return;
	}

	var done = function (errors, window) {

		if (errors) {

			callback(null, errors);
		} else {

			callback(window.$, null);
		}
	};

	var headers = {
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
	};

	var config = {
		url: url,
		src: [jquery],
		headers: headers,
		done: done
	};

	jsdom.env(config);
};

var fetcherWithOptions = function (options, callback) {

	if (typeof options !== object || options === null || options === undefined) {

		callback(null, new Error('Unexpected `options` type.'));
		return;
	}

	var config = {};
	config.src = [jquery];
	config.headers = {
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
	};

	if (options.url) {

		config.url = options.url;
	} else {

		callback(null, new Error('`Options` must has `url` key.'));
		return;
	}

	if (options.headers) {

		config.headers = options.headers;
	}

	if (options.jar) {

		config.jar = options.jar;
	}

	config.done = function (errors, window) {

		if (errors) {

			callback(null, errors);
		} else {

			callback(window.$, null);
		}
	};

	jsdom.env(config);
};

var jQueryify = function (html, callback) {

	var window = jsdom.jsdom(html).parentWindow;

	if (window) {

		jsdom.jQueryify(window, 'http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js', function (w, $) {

			callback($, null);
		});
	} else {

		callback(null, new Error('Failed when convert `html` to window.'));
	}
};


module.exports = {
	fetcher: fetcher,
	jQueryify: jQueryify,
	fetcherWithOptions: fetcherWithOptions
};
