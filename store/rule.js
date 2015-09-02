/**
 * Created on 7/16/15.
 */


var Sequelize = require('sequelize');

function setupDB(opts) {

	if (!opts || typeof opts !== 'object') {

		throw new Error('Invalid db opts.');
	}

	var seq = null;
	var dbname = opts.dbname || null,
		username = opts.username || null,
		password = opts.password || null,
		host = opts.host || null,
		dialect = opts.dialect || null,
		storage = opts.storage || null;

	try {

		seq = new Sequelize(dbname, username, password, {host: host, dialect: dialect, storage: storage});
	} catch(e) {

		throw e;
	}

	var Rule = seq.define('rule', {
		title: {
			type: Sequelize.STRING,
			allowNull: false,
			set: function(val) {
				this.setDataValue('title', val.toLowerCase());
			},
			unique: true
		},
		rule: {
			type: Sequelize.TEXT,
			set: function(val)
				try {

					JSON.parse(val);
				} catch (e) {

					return;
				}

				this.setDataValue('rule', val);
			}
		}
	});


	Rule.createRule = function (title, rule, cb) {

		Rule.create({title: title, rule: rule}).then(function(v) {

			if (cb) {

				cb(null, v);
			}
		}).catch(function(e) {

			if (cb) {

				cb(e);
			}
		});
	};

	Rule.updateById = function (id, opts, cb) {

		Rule.findById(id).then(function(v) {

			if (opts.title) {

				v.title = opts.title;
			}

			if (opts.rule) {

				v.rule = opts.rule;
			}

			v.save();
			if (cb) {

				cb(null, v);
			}
		}).catch(function(e) {

			if (cb) {

				cb(e);
			}
		});
	};

	Rule.updateTitleById = function (id, title, cb) {

		Rule.findById(id).then(function(v) {

			v.title = title;
			v.save();
			if (cb) {

				cb(null, v);
			}
		}).catch(function(e) {

			if (cb) {

				cb(e);
			}
		});
	};

	Rule.updateRuleById = function (id, rule, cb) {

		Rule.findById(id).then(function(v) {

			v.rule = rule;
			v.save();
			if (cb) {

				cb(null, v);
			}
		}).catch(function(e) {

			if (cb) {

				cb(e);
			}
		});
	};

	Rule.getRuleById = function (id, cb) {

		Rule.findById(id).then(function(v) {

			if (cb) {

				cb(null, v);
			}
		}).catch(function(e) {

			if (cb) {

				cb(e);
			}
		});
	};

	Rule.getRuleByTitle = function (title, cb) {

		Rule.findOne({where: {title: title}}).then(function(v) {

			if (cb) {

				cb(null, v);
			}
		}).catch(function(e) {

			if (cb) {

				cb(e);
			}
		});

	};

	Rule.deleteById = function (id, cb) {

		Rule.findById(id).then(function(v) {

			v.destroy();
			if (cb) {

				cb(null);
			}
		}).catch(function(e) {

			if (cb) {

				cb(e);
			}
		});
	};

	Rule.getAll = function (cb) {

		Rule.findAll().then(function(v) {

			if (cb) {

				cb(null, v);
			}
		}).catch(function(e) {

			if (cb) {

				cb(e);
			}
		});
	};

	if (0) {

		Rule.sync({force: true});
	} else {

		Rule.sync();
	}

	return Rule;
}


module.exports = setupDB;