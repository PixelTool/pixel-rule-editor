# Pixel Rule Editor

--------------------

##HOW TO

create `config.js`

```

var setupDB = require('./store/rule');

var auth = {
	username: 'name',
	password: 'passwd'
};

var rule = setupDB({dialect: 'sqlite', storage: __dirname +  '/store/rule.sqlite'});

module.exports = {
	auth: auth,
	rule: rule
};
```


```
npm install
bower install
webpack
npm start
```
