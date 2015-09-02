/**
 * Created on 7/16/15.
 */

var express = require('express');
var router = express.Router();
var fetcher = require('../misc/fetcher').fetcher;
var Pixel = require('pixeljs');
var auth = require('../config').auth;
var Rule = require('../config').rule;
var crypto = require('crypto');

var tokens = {};

router.use(function(req, res, next) {

	console.log('originalUrl===', req.originalUrl);
	console.log('body===', req.body);
	console.log('query===', req.query);
	console.log('cookies===', req.cookies);
	console.log('method===', req.method);
	console.log('url ===', req.url);

	if (req.url === '/login' && req.method === 'POST') {

		next();
	} else {

		if (isLoggedin(req)) {

			next();
		} else {

			if (req.url.replace('?', '') === '/' && req.method === 'GET') {

				res.redirect('/editor/login');
			} else if (req.url.replace('?', '') === '/login' && req.method === 'GET') {

				next();
			} else {

				res.send(errorMsg('Need login.'));
			}
		}
	}

});



router.get('/', function(req, res) {

	res.render('rule_editor', {title: 'Pixel Rule Editor', loggedin: true});
});

router.get('/login', function(req, res) {

	if (isLoggedin(req)) {

		res.redirect('/editor');
	} else {

		res.render('rule_editor', {title: 'Pixel Rule Editor', loggedin: false});
	}
});

router.post('/login', function(req, res) {

	var username = req.body.username,
		password = req.body.password;

	if (username === auth.username && password === auth.password) {

		var token = crypto.randomBytes(48).toString('hex');
		tokens[username] = token;
		console.log(tokens);
		res.cookie('token', token, {path: '/editor', maxAge: 90000000, httpOnly: true});
		res.cookie('username', username);
		res.send({redirect: '/editor'});
		//res.send(successData(null));
	} else {

		res.send(errorMsg('Invalid `username` or `password`.'));
	}
});

router.get('/allrule', function(req, res) {
	Rule.getAll(function(e, v) {

		if (e) {

			res.send(errorMsg(e.message));
		} else {

			res.send(successData(v));
		}
	});
});

router.get('/rule/:id', function(req, res) {

	var id = parseInt(req.params.id);

	if (id) {

		Rule.getRuleById(id, function(e, v) {
			if (e) {

				res.send(errorMsg(e.message));
			} else {

				res.send(successData(v));
			}
		});
	} else {

		res.send(errorMsg('Require `id`.'));
	}
});

router.post('/rule/', function(req, res) {

	console.log(req.body, req.params);

	var title = req.body.title;
	var rule = req.body.rule;

	if (title && title.length) {

		if (isValidJSON(rule)) {

			Rule.createRule(title, rule, function(e, v) {

				if (e) {

					res.send(errorMsg(e.message));
				} else {

					res.send(successData(v));
				}
			})
		} else {

			res.send(errorMsg('Invalid `rule`.'));
		}

	} else {

		res.send(errorMsg('Require `title`.'));
	}

});

router.put('/rule/:id', function(req, res) {

	var id = parseInt(req.params.id);

	var title = req.body.title;
	var rule = req.body.rule;

	var opts = {};
	if (title && title.length) {

		opts.title = title;
	}

	if (isValidJSON(rule)) {

		opts.rule = rule;
	}

	if (id) {

		Rule.updateById(id, opts, function(e, v) {

			if (e) {

				res.send(errorMsg(e.message));
			} else {

				res.send(successData(v));
			}
		});
	} else {

		res.send(errorMsg('Require `id`.'));
	}

});

router['delete']('/rule/:id', function(req, res) {
	var id = parseInt(req.params.id);
	Rule.deleteById(id, function(e) {

		if (e) {

			res.send(errorMsg(e.message));
		} else {

			res.send(successData());
		}
	});
});

router.post('/test/', function(req, res) {

	var id = parseInt(req.body.id);
	var url = req.body.url;
	var rule = req.body.rule;

	console.log(url)
	if (url && rule) {

		new Pixel().setup(rule, url, null, fetcher).then(function(v) {

			res.send(successData(v));
		}, function(e) {

			res.send(errorMsg(e.message));
		});
	} else if (id && url) {

		Rule.getRuleById(id, function(e, v) {

			if (e) {

				res.send(errorMsg(e.message));
			} else {

				new Pixel().setup(v.rule, url, null, fetcher).then(function(data) {

					res.send(successData(data));
				}, function(err) {

					res.send(errorMsg(err.message));
				});
			}
		});
	} else {

		res.send(errorMsg('Require more args.'));
	}

});

function successData(data) {

	return {
		success: true,
		data: data || null
	}
}

function errorMsg(msg) {

	return {
		success: false,
		message: msg || null
	}
}

function isValidJSON(text) {

	try {

		JSON.parse(text);
	} catch(e) {

		return false;
	}
	return true;
}

function isLoggedin(req) {

	var token = req.cookies.token;
	var username = req.cookies.username;

	if (tokens[username] !== undefined && tokens[username] === token) {

		return true;
	}
	return false;
}

module.exports = router;