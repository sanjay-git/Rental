(function() {
	console.log("goRentalApp");
	var app = angular.module("goRentalApp", ['ui.router']);

	app.controller('loginCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth) {
		$scope.username = "";
		$scope.password = "";
		$scope.cities = [
		"Select City",
		"Hyderabad",
		"Bangalore",
		"Chennai",
		"Pune",
		"Mumbai",
		"Delhi"
		];
		$scope.city = $scope.cities[0];

		$scope.checkLogin = function() {
			//Todo: Logic authentication code goes here. For now, checking for non empty username and password fields
			if($scope.username != "" && $scope.password !== "") {
			auth.login({
				email: $scope.username,
				password: $scope.password
			}).error(function(error) {
				console.log(error);
			}).then(function() {

			});
				//Todo: Go to Home Page
			} else {
				//Todo: Show error text and provide Register link
			}
		}

		$scope.registerUser = function() {
			auth.register({
				email: $scope.username,
				password: $scope.password
			}).error(function(error) {
				console.log(error);
			}).then(function() {

			})
		}

	}]);

	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

		 $urlRouterProvider.otherwise('/login');

		var loginState = {
			name: "login",
			url: "/login",
			templateUrl: "./login/user-login.html",
			controller: 'loginCtrl'
		}

		var registerState = {
			name: 'register',
			url: '/register',
			template: '<span> Register view should come here </span>'
		}

		$stateProvider.state(loginState);
		$stateProvider.state(registerState);

	}]);

	app.factory('auth', ['$http', function($http) {
		var auth = {};
		auth.register = function(user) {
			return $http.post('/registerUser', user).success(function(data) {
				console.log(data);
			});
		}

		auth.login = function(user) {
			return $http.post('/loginUser', user).success(function(data) {
				console.log(data);
			});
		}

		return auth;
	}])

})();