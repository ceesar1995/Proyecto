// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'views/logIn.html',
            controller: 'LogInController'
        })

        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })

        .when('/views/firstLogIn.html', {
            templateUrl: 'views/createPlayer.html',
            controller: 'RegisterController'
        })
        .when('/createTeam', {
            templateUrl: 'views/createTeam.html',
            controller: 'RegisterController'
        })
        .when('/joinTeam', {
            templateUrl: 'views/joinTeam.html',
            controller: 'RegisterController'
        })
        .when('/home', {
                templateUrl: 'views/forum.html',
                controller: 'ForumController'
        })
        .when('/views/home.html', {
        templateUrl: 'views/forum.html',
        controller: 'ForumController'
        })
        .when('/selectPlayer', {
            templateUrl: 'views/selectPlayer.html',
            controller: 'SelectPlayerController'
        })
        .when('/selectTeam', {
            templateUrl: 'views/selectTeam.html',
            controller: 'SelectTeamController'
        })
        .when('/playersTeam', {
        templateUrl: 'views/playersTeam.html',
        controller: 'PlayersTeamController'
         })
        .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchController'
         })
        .when('/createMatch', {
        templateUrl: 'views/createMatch.html',
        controller: 'CreateMatchController as $ctrl'
         })
        .when('/pendingMatches', {
            templateUrl: 'views/pendingMatches.html',
            controller: 'PendingMatchesController'
        });





    $locationProvider.html5Mode(true);

}]);