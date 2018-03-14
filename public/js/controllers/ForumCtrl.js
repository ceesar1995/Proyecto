// public/js/controllers/ForumCtrl.js
var app = angular.module('ForumCtrl', ['homeDirectives','ApiService','SelectService']);

app.controller('ForumController', function($scope,$compile,$http,$localStorage,ApiService,$location,SelectService) {

    $scope.searchForm = "";

    $scope.errorMessage = "";

    $scope.teams = [];

    $scope.message = {
        date: null,
        text: "",
        subject:""
    };
    var  messagePlayerForum = {
        idPlayer : null,
        idTeam: null,
        idMessage: null
    };
    $http.defaults.headers.common.Authorization =  $localStorage.currentUser.token;
    ApiService.getMessagesForum($localStorage.currentTeam.team_id).then(
        function (response) {
            console.log(response.data);
            $scope.messages = response.data.messages.reverse();
            $scope.players = response.data.players.reverse();
            for(var i = 0;i<$scope.messages.length;i++){
                $scope.messages[i].player = $scope.players[i][0].name;
            }
            console.log($scope.messages);
        }
    );

    var target = document.getElementById('box');
    /*
    angular.element(target).append($compile(forum-card));
    angular.element(target).append($compile(forum-card));
    angular.element(target).append($compile(forum-card));
   */

    $scope.sendMessage = function () {
        $scope.message.date = new Date();
        ApiService.createMessage($scope.message).then(
            function (responseMessage) {
                if(responseMessage.statusText=="OK"){
                    messagePlayerForum.idMessage = responseMessage.data._id;
                    messagePlayerForum.idPlayer = $localStorage.currentPlayer.player_id;
                    messagePlayerForum.idTeam = $localStorage.currentTeam.team_id;
                    ApiService.sendMessageForum(messagePlayerForum).then(
                        function (responseMessageForum) {
                            if(responseMessageForum.statusText=="OK"){
                                console.log(responseMessageForum.data);
                                var message = {
                                    date: $scope.message.date,
                                    text: $scope.message.text,
                                    subject:$scope.message.subject,
                                    player:$localStorage.currentPlayer.player_name

                                };
                                $scope.messages.reverse();
                                $scope.messages.push(message);
                                $scope.messages.reverse();
                                $scope.message = {
                                    date: null,
                                    text: "",
                                    subject:""
                                };
                            }
                        }
                    )
                }
            }
        )
    }

    $scope.search = function () {
        $location.path("/search");
        ApiService.findTeamsByName($scope.searchForm).then(function (teamsResponse) {
            console.log(teamsResponse.data);
            $scope.teams = teamsResponse.data;
            for(var i = 0;i<$scope.teams.length;i++){
                $scope.teams[i].provinces = SelectService.getNamesByIds($scope.teams[i].province);
            }
        });
        if($scope.teams.length===0){
            $scope.errorMessage = "No se encontraron equipos";
        }
    }
    
    $scope.logOut = function () {
        $localStorage.$reset();
        $http.defaults.headers.common.Authorization = "";
        window.location.href = "/";
    }
});

app.controller('PlayersTeamController', function($scope,$compile,$http,$localStorage,ApiService,SelectService) {

    ApiService.getPlayersTeam($localStorage.currentTeam.team_id).then(
        function (response) {

            $scope.players = response.data;
            for(var i = 0;i<$scope.players.length;i++){
                $scope.players[i].provinces = SelectService.getNamesByIds($scope.players[i].province);
            }
            console.log($scope.players);
        }
    );
});
app.controller('SearchController', function($scope,$localStorage,ApiService,SelectService) {

    $scope.players = [];

    $scope.searchPlayers = function () {

        $scope.teams = [];

        ApiService.findPlayersByName($scope.searchForm).then(function (response) {
            console.log(response.data);
            $scope.players = response.data.players;
            var teamNumbers = response.data.teamNumber;
            var teams = response.data.teams;
            for(var i = 0;i<$scope.players.length;i++){
                $scope.players[i].provinces = SelectService.getNamesByIds($scope.players[i].province);
            }

            for(var i =0 ; i< teamNumbers.length;i++){
                $scope.players[i].teamNames = "";
                for(var j = 0; j<teamNumbers[i];j++){
                    $scope.players[i].teamNames = $scope.players[i].teamNames + " " + teams[j].name;
                }
            };

            console.log($scope.players);
            if($scope.players.length === 0){
                $scope.errorMessage = "No se encontraron jugadores";
            }
            else{
                $scope.errorMessage = "";
            }

        });
    };
    $scope.searchTeams = function () {

        $scope.players = [];

        ApiService.findTeamsByName($scope.searchForm).then(function (teamsResponse) {
            console.log(teamsResponse.data);
            $scope.teams = teamsResponse.data;
            for(var i = 0;i<$scope.teams.length;i++){
                $scope.teams[i].provinces = SelectService.getNamesByIds($scope.teams[i].province);
            }
            if($scope.teams.length ===0){
                $scope.errorMessage = "No se encontraron equipos";
            }
            else{
                $scope.errorMessage = "";
            }
        });
    };

});
