App = Ember.Application.create({
	secondsViewed: 0
});

setInterval(function() {
	var viewed = App.get('secondsViewed');
	App.set('secondsViewed', viewed + 1);
}, 1000);

App.LoadingRoute = Ember.Route.extend({
	activate: function() {
		Pace.restart();
	},
	deactivate: function() {
		Pace.stop();
	}
});

App.Router.map(function() {
	this.resource('browse', { path: ':letter' }, function() {
		this.resource('artist', { path: ':artist' }, function() {
			this.resource('lyric', { path: ':song' });
			this.resource('lyricEdit', { path: ':song/edit' });
		});
	});
	this.resource('search', { path: '/search/:kwd' });
	/*
	this.resource('lyric', { path: '/lyric/:song' }, function() {
		this.route('add');
		this.route('edit', { path: '/lyric/edit/:song' });
	});
	*/
});

/*
App.Store = DS.Store.extend({
	revision: 11,
	host: 'http://rudikovac.com/playground/ember'
});

App.Artist = DS.Model.extend({
	initial: DS.attr(),
	artists: DS.attr()
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
	host: 'http://rudikovac.com/playground/ember'
});

App.ApplicationRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('artist');
	}
});

App.IndexRoute = Ember.Route.extend({
	
});
*/

App.Artist = Ember.Object.extend();
App.Artist.reopenClass({
	initials: function() {
		return $.getJSON("http://zapoj.me/ajax.php?initials").then(function(data) {
			var letters = [];
			data.initials.forEach(function(initial) {
				letters.push(initial);
			});
			return letters;
		});
	},
	artists: function(params) {
		return $.getJSON("http://zapoj.me/ajax.php?artists=" + params).then(function(data) {
			var artists = [];
			data.artists.forEach(function(artist) {
				artists.push(artist);
			});
			return { 'initial': params, 'artists': artists };
		});
	}
});

App.ApplicationRoute = Ember.Route.extend({
	model: function() {
		//return App.Artist.initials();
		var str = "-ABCČDEFGHIJKLMNOPQRSŠTUVWXYZŽ";
		var alphabet = new Array();
		for (var i = 0; i < str.length; i++) {
			var nextChar = str.charAt(i);
			alphabet.push(nextChar);
		}
		return alphabet;
	}
});

App.ApplicationController = Ember.Controller.extend({
	actions: {
		search: function() {
			var data = {
				search: this.get('kwd')
			};
			this.get('target.router').transitionTo('search', this.get('kwd'));
		}
	}
});

App.BrowseRoute = Ember.Route.extend({
	model: function(params) {
		/*return $.get("http://zapoj.me/ajax.php?bands").then(function(data) {
			return { "initial": params.letter, "initials": data.initials[params.letter] };
		});*/
		return App.Artist.artists(params.letter);
	}
});

App.ArtistRoute = Ember.Route.extend({
	model: function(params) {
		return $.get("http://zapoj.me/ajax.php?artist=" + params.artist).then(function(data) {
			return data;
		});
	}
});

App.ArtistLyricRoute = Ember.Route.extend({
	model: function(params) {
		return $.get("http://zapoj.me/ajax.php?lyric=" + params.song).then(function(data) {
			return data;
		});
	}
});

App.LyricRoute = Ember.Route.extend({
	model: function(params) {
		return $.get("http://zapoj.me/ajax.php?lyric=" + params.song).then(function(data) {
			return data;
		});
	}
});

App.LyricEditRoute = Ember.Route.extend({
	model: function(params) {
		return $.get("http://zapoj.me/ajax.php?lyric=" + params.song).then(function(data) {
			return data;
		})
	},
	actions: {
		save: function() {
			var lyric = this.modelFor('lyricEdit');
			this.transitionTo('lyric', lyric);
		}
	}
});

App.SearchRoute = Em.Route.extend({
	model: function(params) {
		return $.post('http://zapoj.me/ajax.php', { search: params.kwd }).done(function(data) {
			return data;
		});
	}
});

App.BrowseController = Ember.Controller.extend({
	isActive: false,
	actions: {
		doStuff: function() {
			this.toggleProperty('isActive');
		}
	}
});