// public/js/controllers/LogInCtrl.js
var app = angular.module('LogInCtrl', ['ApiService','RouterService','ngStorage']);

app.controller('LogInController', function($scope,ApiService,RouterService,$http,$localStorage,$location) {

    $scope.username = '';
    $scope.password = '';


   $scope.checkUser = function(){
       var userData ={ "username" :$scope.username , "password" :$scope.password };
       ApiService.logInUser(userData).then(
            function (response){
                var token = response.data.token;
                if (token) {
                    var id = response.data.user_id;
                    // store username and token in local storage to keep user logged in between page refreshes
                    $localStorage.currentUser = {user_id: id, token: token};

                    // add jwt token to auth header for all requests made by the $http service
                    $http.defaults.headers.common.Authorization =  token;
                    //'Bearer ' +
                    //RouterService.openPage("/views/home.html")

                    ApiService.getUserById(id).then(function (response) {
                        if(response.statusText=="OK"){
                            if(response.data.idPlayer){
                                ApiService.getPlayerById(response.data.idPlayer).then(function (responsePlayer) {
                                    $localStorage.currentPlayer = {player_id: responsePlayer.data._id, player_name : responsePlayer.data.name};
                                    $location.path("/selectTeam");
                                });
                            }
                            else{
                                RouterService.openPage("/views/firstLogIn.html");
                            }

                        }
                    })


                }
            });

   };


});

app.controller('SelectPlayerController',function ($scope,$localStorage,ApiService) {

    $scope.players = [];
    var id = $localStorage.currentUser.user_id;
    ApiService.getPlayerByUserId(id).then(
        function (response) {

            $scope.players = response.data;
            console.log($scope.players);
        }
    );

    $scope.selectPlayer = function (player) {
        $localStorage.currentPlayer = {player_id: player._id, player_name : player.name};
        //$location.path("/selectTeam");
    }

});
app.controller('SelectTeamController',function ($scope,$localStorage,ApiService,$timeout) {

    $scope.teams = [];
    var id = $localStorage.currentPlayer.player_id;
    ApiService.getTeamsByPlayerId(id).then(
        function (response) {

            $scope.teams = response.data;
            console.log($scope.teams);
        }
    );

    $scope.selectTeam = function (id) {
        $localStorage.currentTeam = {team_id: id};
        //window.location.href = "/views/home.html";
        //$event.currentTarget.class="active";
        $timeout(sendHome,2000);
        console.log(id);
    }
    function sendHome () {
        window.location.href = "/views/home.html"
    }
});
