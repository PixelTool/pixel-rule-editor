/**
 * Created on 7/16/15.
 */

var config = require('./config');
var JSONPretty = require('json-stringify-pretty-compact');

require('jquery');
require('bootstrap');

require('../public/stylesheets/rule_editor.less');

window.$ = $;

var BOSS = {};

BOSS.allRule = [];

var baseurl = 'http://' + window.location.host + '/editor';

$(function() {

	loadRules();

	$(document).on('change', '#select-rule', function() {

		setSelectedRule($(this)[0]);
	});

	$('#selected-rule-title').keyup(function() {

		$(':selected', '#select-rule').text($(this).val());
		BOSS.currentRule.title = $(this).val();
	});

	$('#selected-rule-detail').keyup(function() {

		BOSS.currentRule.rule = $(this).val();
	}).focusin(function() {

		console.log('focusin');
		BOSS.currentRule.rule = $(this).val();
	}).focusout(function() {

		console.log('focusout');
		BOSS.currentRule.rule = $(this).val();
	});

	$('#btn-new').on('click', function() {

		var new_rule = {
			title: 'Untitled',
			rule: null
		};

		BOSS.allRule.push(new_rule);

		BOSS.currentRule = new_rule;
		$('#select-rule').append('<option selected="selected">' + new_rule.title + '</option>');
		$('#selected-rule-title').val(BOSS.currentRule.title);
		$('#selected-rule-detail').val(BOSS.currentRule.rule);
	});

	$('#btn-save').on('click', function() {

		console.log('click');

		var currentRule = BOSS.currentRule;

		if (currentRule.id) {

			$.ajax({
				url: baseurl + '/rule/' + currentRule.id,
				method: 'PUT',
				data: 'title=' + currentRule.title + '&rule=' + currentRule.rule
			}).done(function(res) {

				console.log(res);
				if (res.success) {

					alert('Update rule success.');
				} else {

					alert('Update rule failed. ' + res.message);
				}
			});

		} else {

			if (isValidJSON(currentRule.rule)) {

				$.post(baseurl + '/rule/', BOSS.currentRule).then(function(res) {

					console.log(res);
					if (res.success) {

						if (res.data) {

							BOSS.currentRule.id = res.data.id;
						}
						alert('Create rule success.');
					} else {

						alert('Create rule failed. ' + res.message);
					}
				});
			} else {

				alert('Invalid JSON format.');
			}
		}
	});

	$('#btn-delete').on('click', function() {

		var currentRule = BOSS.currentRule;
		var currentIdx = $('#select-rule')[0].selectedIndex;

		var reconfirm = confirm('Confirm delete rule ' + currentRule.title + '.');

		if (reconfirm) {

			if (currentRule.id) {

				$.ajax({
					url: baseurl + '/rule/' + currentRule.id,
					method: 'DELETE'
				}).then(function(res) {

					console.log(res);

					if (res.success) {

						alert('Delete rule ' + currentRule.title + ' success.');
						refreshOptions(currentIdx);
					} else {

						alert('Delete rule ' + currentRule.title + ' failed.' + res.message);
					}
				});
			} else {

				refreshOptions(currentIdx);
			}
		}

		function refreshOptions(idx) {

			BOSS.allRule.splice(idx, 1);
			idx = idx > 0 ? idx - 1: idx;
			BOSS.currentRule = BOSS.allRule[idx];
			$(':selected', '#select-rule').remove();
			$('#select-rule option:eq(' + idx + ')').prop('selected', true);

			if (BOSS.currentRule) {

				$('#selected-rule-title').val(BOSS.currentRule.title || '');
				$('#selected-rule-detail').val(BOSS.currentRule.rule || '');
			} else {

				$('#selected-rule-title').val('');
				$('#selected-rule-detail').val('');
			}
		}

	});

	$('#btn-validate').on('click', function() {

		try {

			JSON.parse($('#selected-rule-detail').val());
		} catch(e) {

			alert(e);
			return;
		}

		alert('Valid JSON format.');

		var prettyJSON = JSONPretty(JSON.parse($('#selected-rule-detail').val()));
		$('#selected-rule-detail').val(prettyJSON);
	});

	$('#btn-test-url').on('click', function() {

		try {

			JSON.parse($('#selected-rule-detail').val());
		} catch(e) {

			alert(e);
			return;
		}

		var currentRule = BOSS.currentRule;
		var url = $('#test-url').val();

		if (currentRule.id && url) {
			var params = {id: currentRule.id, url:url};

			$.post(baseurl + '/test/', params, function(res) {

				console.log(res);
				if (res.success) {

					if (res.data) {

						var prettyJSON = JSONPretty(res.data);
						$('#test-result').val(prettyJSON);
					}
				} else {

					alert(res.message);
				}
			});
		} else if (url) {

			var params = {id: currentRule.id, rule: currentRule.rule};

			$.post(baseurl + '/test/', params, function(res) {

				console.log(res);
				if (res.success) {

					if (res.data) {

						var prettyJSON = JSONPretty(res.data);
						$('#test-result').val(prettyJSON);
					}
				} else {

					alert(res.message);
				}
			});
		}
	});
});

function loadRules() {

	$.get(baseurl + '/allrule').then(function(res) {

		if (res.success) {

			if (res.data && res.data.length) {

				BOSS.allRule = res.data;

				var html = '';
				res.data.forEach(function(item) {

					html += '<option>' + item.title + '</option>';
				});

				var $select_rule = $('#select-rule');
				$select_rule.html(html);
				setSelectedRule($select_rule[0]);
			}
		}
	});
}

function setSelectedRule(sel) {

	console.log(sel);
	var selectedIndex = sel.selectedIndex;
	var currentRule = BOSS.allRule[selectedIndex];
	console.log(currentRule);
	BOSS.currentRule = currentRule;
	$('#selected-rule-title').val(currentRule.title);

	try {

		var prettyJSON = JSONPretty(JSON.parse(currentRule.rule));
		$('#selected-rule-detail').val(prettyJSON);
	} catch(e) {

		console.log(e);
		$('#selected-rule-detail').val(currentRule.rule);
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