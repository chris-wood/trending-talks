angular.module('trending-talks', ['ngRoute', 'ngMessages']).config(function($routeProvider) {

	// Configure the routes
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl'
		})
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignupCtrl'
		})
		.when('/trend/:id', {
			templateUrl: 'views/trend.html',
			controller: 'TrendCtrl'
		})
		.otherwise('/');
});