(function() {
	console.log("goRentalApp");
	var app = angular.module("goRentalApp", ['ui.router']);

	app.run(function ($state,authToken,$rootScope) {
		$rootScope.user = {};
	    $rootScope.$state = $state;
	    $rootScope.isAuthenticated = authToken.isAuthenticated
	});

	app.controller('navCtrl', ['$scope', 'authToken', function($scope, authToken) {
		$scope.userName = ""
	}]);

	app.controller('loginCtrl', ['$scope', '$state', 'auth', '$rootScope', function($scope, $state, auth, $rootScope) {
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
		$scope.reg_city = $scope.cities[0];

		$scope.checkLogin = function() {
			//Todo: Logic authentication code goes here. For now, checking for non empty username and password fields
			if($scope.username != "" && $scope.password !== "") {
				auth.login({
					email: $scope.username,
					password: $scope.password
				}).error(function(error) {
					console.log(error);
				}).then(function() {
					$rootScope.user.name = $scope.username;
					$state.go('home');
				});
			} else {
				//Todo: Show error text and provide Register link
			}
		}

		$scope.registerUser = function() {
			auth.register({
				email: $scope.reg_username,
				password: $scope.reg_password,
				phone: $scope.reg_phone,
				city: $scope.reg_city
			}).error(function(error) {
				console.log(error);
			}).then(function() {
				$rootScope.user.name = $scope.username;
				$state.go('home');
			})
		}

	}]);

	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

		 $urlRouterProvider.otherwise('/home');

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

		var homeState = {
			name: 'home',
			url: '/home',
			templateUrl: './main/main.html'
		}

		$stateProvider.state(loginState);
		$stateProvider.state(registerState);
		$stateProvider.state(homeState);

	}]);

	app.factory('auth', ['$http', 'authToken', function($http, authToken) {
		var auth = {};
		auth.register = function(user) {
			return $http.post('/registerUser', user).success(function(data) {
				console.log(data);
				authToken.setToken(data);
			});
		}

		auth.login = function(user) {
			return $http.post('/loginUser', user).success(function(data) {
				console.log(data);
				authToken.setToken(data);
			});
		}

		return auth;
	}])

	app.factory('authToken', function($window) {
		var storage = $window.localStorage;
		var cachedToken;
		var userToken = "userToken";

		var authToken = {
			setToken: function(token) {
				cachedToken = token;
				storage.setItem(userToken, token);
			},
			getToken: function() {
				if(!cachedToken)
					cachedToken = storage.getItem(userToken);

				return cachedToken;
			},
			isAuthenticated: function() {
				return !!authToken.getToken();
			},
			removeToken: function() {
				cachedToken = null;
				storage.removeItem(userToken);
			}
		}

		return authToken;
	})

})();