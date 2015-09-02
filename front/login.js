/**
 * Created on 7/20/15.
 */

require('jquery');
require('bootstrap');

require('../public/stylesheets/login.less');

var baseurl = 'http://' + window.location.host + '/editor';

$(function() {

	$(document).on('submit', function() {

		var username = $('#input-username').val();
		var password = $('#input-password').val();
		$.post(baseurl + '/login', {username: username, password: password}).then(function(res) {

			console.log(res);
			if (res.redirect) {

				window.location = res.redirect;
			} else {

				alert(res.message);
			}
		});
		return false;
	});
});