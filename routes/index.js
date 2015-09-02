var express = require('express');
var router = express.Router();
var Rule = require('../config').rule;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/all', function(req, res) {

  Rule.getAll(function(e, v) {

    if (e) {

      res.send(errorMsg(e.message));
    } else {

      res.send(successData(v));
    }
  });
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

module.exports = router;
