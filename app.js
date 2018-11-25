(function () {
	'use strict';

	angular.module('NeustarCodeAssignment', [
			'ngAnimate',
			'ngRoute',
			'ui.bootstrap',
			'toaster'
		])
		.config(config);

	function config($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'main/main.html',
				controller: 'MainController',
				controllerAs: 'vm'
			})
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.hashPrefix('');
	}
})();
