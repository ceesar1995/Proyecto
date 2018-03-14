// public/js/controllers/RegisterCtrl.js
angular.module('RegisterCtrl', ['SelectService','ApiService','RouterService','ngStorage']).controller('RegisterController', function($http,$scope,$rootScope,SelectService,ApiService,RouterService,$localStorage,$location) {

    if($localStorage.currentUser){
        $http.defaults.headers.common.Authorization =  $localStorage.currentUser.token;
    }

    $scope.user = {
        username:'',
        password:'',
        email: '',
        dateEnrolled: null,
        name: '',
        surname:'',
        dateBorn: null
    }
    $scope.provinces = SelectService.getProvinces();

    $scope.player = {
        idUser: null,
        name:'',
        province:null,
        goalkeeper:false,
        coordinator:false,
    }

    $scope.team = {
        name:'',
        province:null,
        dateCreated: null,
    }

    $scope.teams = [];

    if(RouterService.getSavedData()){
        $scope.player=RouterService.getSavedData();
    }

    $scope.registerUser = function(){
        $scope.user.dateEnrolled = new Date();
        var userData = $scope.user;
        ApiService.registerUser(userData).then(
            function (response){
                if(response.statusText=="OK"){
                    var token = response.data.token;
                    if (token) {
                        var id = response.data.user_id;
                        // store username and token in local storage to keep user logged in between page refreshes
                        $localStorage.currentUser = {user_id: id, token: token};
                        RouterService.openPage("/views/firstLogIn.html");
                    }
                }
//                    console.log(response);
            });
    };

    $scope.savePlayerData = function () {
        $scope.player.idUser = $localStorage.currentUser.user_id;
        RouterService.setSavedData($scope.player);
        if($scope.player.coordinator==true) {
            $location.path("/createTeam");
        }
        else{
            $location.path("/joinTeam");
        }


    }
    $scope.registerPlayerAndTeam = function () {
        //$http.defaults.headers.common.Authorization =  $localStorage.currentUser.token;
        //console.log($scope.player.province);
        ApiService.createPlayer(RouterService.getSavedData()).then(
            function (responsePlayer) {
                if(responsePlayer.statusText=="OK"){
                    $scope.team.dateCreated = new Date();
                    ApiService.createTeam($scope.team).then(
                        function (responseTeam) {
                            if(responseTeam.statusText=="OK"){
                                playerTeamData ={
                                    idPlayer : responsePlayer.data._id,
                                    idTeam : responseTeam.data._id,
                                    date : new Date(),
                                    creator : true,
                                    privileges : true,
                                    active : true
                                }
                                ApiService.addPlayerToTeam(playerTeamData).then(
                                    function (responsePlayerToTeam) {
                                        console.log(responsePlayerToTeam.data);
                                        ApiService.updateUser( $localStorage.currentUser.user_id,{idPlayer:responsePlayerToTeam.data.idPlayer}).then(function (responseUser) {
                                            $localStorage.currentTeam= {team_id: responsePlayerToTeam.data.idTeam};
                                            $localStorage.currentPlayer = {player_id: responsePlayerToTeam.data.idPlayer, player_name : responsePlayer.data.name};
                                            window.location.href = "/views/home.html";
                                        })
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    }

    $scope.searchTeam = function () {
        ApiService.findTeamsByName($scope.team.name).then(function (teamsRespond) {
           if(teamsRespond.statusText=="OK"){
               $scope.teams = teamsRespond.data;
               for(var i = 0;i<$scope.teams.length;i++){
                   $scope.teams[i].provinces = SelectService.getNamesByIds($scope.teams[i].province);
               }
               console.log($scope.teams);
           }
        });
    }
    $scope.selectTeam = function (team) {
        ApiService.createPlayer(RouterService.getSavedData()).then(
            function (responsePlayer) {
                if (responsePlayer.statusText == "OK") {
                    var playerTeamData ={
                        idPlayer : responsePlayer.data._id,
                        idTeam : team._id,
                        date : new Date(),
                        creator : false,
                        privileges : false,
                        active : true
                    };
                    ApiService.addPlayerToTeam(playerTeamData).then(
                        function (responsePlayerToTeam) {
                            console.log(responsePlayerToTeam.data);
                            ApiService.updateUser( $localStorage.currentUser.user_id,{idPlayer:responsePlayerToTeam.data.idPlayer}).then(function (responseUser) {
                                $localStorage.currentTeam= {team_id: team._id};
                                $localStorage.currentPlayer = {player_id: responsePlayer.data._id, player_name : responsePlayer.data.name};
                                window.location.href = "/views/home.html";
                            })
                        }
                    )

                }
            });
    }

});
