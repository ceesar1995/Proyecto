// public/js/controllers/LogInCtrl.js
var app = angular.module('LogInCtrl', ['ApiService','RouterService','ngStorage','ui.bootstrap','ngAnimate','ngTouch','AnnouncementService','ModalService']);

app.controller('LogInController', function($scope,ApiService,RouterService,$http,$localStorage,$location,$timeout) {

    $scope.username = null;
    $scope.password = null;

    $scope.popoverOpen = false;

    $scope.submitted = false;

   $scope.checkUser = function(){
        $scope.submitted = true;
       if($scope.username && $scope.password){

           var userData ={ "username" :$scope.username , "password" :$scope.password };
           ApiService.logInUser(userData).then(
               function (response){

                   var token = response.data.token;
                   if (token) {
                       var id = response.data.user_id;
                       // store username and token in local storage to keep user logged in between page refreshes
                       $localStorage.currentUser = {user_id: id, token: token, username: response.data.username};

                       // add jwt token to auth header for all requests made by the $http service
                       $http.defaults.headers.common.Authorization =  token;

                       ApiService.getUserById(id).then(function (response) {
                           if(response.statusText=="OK"){
                               if(response.data.idPlayer){
                                   ApiService.getPlayerById(response.data.idPlayer).then(function (responsePlayer) {
                                       $localStorage.currentPlayer = {player_id: responsePlayer.data._id, player_name : responsePlayer.data.name,player_coordinator:responsePlayer.data.coordinator};
                                       $location.path("/selectTeam");
                                   });
                               }
                               else{
                                   $timeout(sendFirstLogIn,2000);
                               }

                           }
                       })


                   }
                   else{
                       $scope.popoverOpen = true;
                       $timeout(turnOffPopover,2000);
                   }

               }).catch(function (error) {
               $scope.popoverOpen = true;
               $timeout(turnOffPopover,2000);
               console.log("OLE");
           });
       }


   };

   var turnOffPopover = function () {
       $scope.popoverOpen = false;
   }
    function sendFirstLogIn () {
        $location.path("/firstLogIn");
    }


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
        $localStorage.currentPlayer = {player_id: player._id, player_name : player.name,player_coordinator:player.coordinator};
    }

});
app.controller('SelectTeamController',function ($scope,$localStorage,ApiService,$timeout,$uibModal,ModalService,$log,$location) {

    $scope.teams = [];
    var id = $localStorage.currentPlayer.player_id;
    ApiService.getTeamsByPlayerId(id).then(
        function (response) {
            if(response.statusText=="OK"){
                $scope.teams = response.data;
                console.log($scope.teams);
                if($scope.teams.length==0){
                    if($localStorage.currentPlayer.player_coordinator==true) {
                        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/createOrJoinTeam.html','ModalCreateOrJoinTeamCtrl'));
                        modalInstance.result.then(function (createTeam) {
                            if(createTeam){
                                $location.path("/createTeam");
                            }
                            else {
                                $location.path("/joinTeam");
                            }
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });

                    }
                    else{
                        $location.path("/joinTeam");
                    }
                }
            }


        }
    );

    $scope.selectTeam = function (id,team) {
        var data = {
            data: function () {
                return 'Vas a seleccionar a '+team.name+' como equipo¿Estás seguro?';
            }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
        modalInstance.result.then(function () {
            console.log("CONFIRMADO");
           selectTeam(id,team);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
    var selectTeam = function (id,team) {
        $localStorage.currentTeam = {team_id: id, team_name:team.name};
        $timeout(sendHome,2000);
        console.log(id);
    }
    function sendHome () {
        window.location.href = "/home"
    }


});

app.controller('ForgottenPasswordController',function ($scope,$localStorage,ApiService,$timeout,$uibModal,ModalService,$log,$location) {


    $scope.email = "";

    $scope.sendPasswordEmail = function (invalid) {
        $scope.submitted = true;
        if(!invalid){
            ApiService.sendEmailResetPassword($scope.email).then(
                function (response) {
                    if(response.statusText="OK"){
                        if(response.data){
                            window.alert("Email enviado correctamente");
                        }
                        else{
                            window.alert("No existe ningún usuario con ese email");
                        }
                    }
                }
            )
        }
    }
});
app.controller('ResetPasswordController',function ($scope,ApiService,$http) {


    $scope.password = "";
    $scope.password2 = "";

    $scope.sendResetPassword = function (invalid) {
        $scope.submitted = true;
        if(!invalid){
            if($scope.password != $scope.password2){
                window.alert("Las contraseñas no son iguales")
            }
            else{
                var url_string = window.location.href;
                var slices = url_string.split("resetPassword/");
                var token = slices[1];
                $http.defaults.headers.common.Authorization =  token;

                ApiService.resetPassword({password:$scope.password}).then(
                    function (response) {
                        if(response.statusText="OK"){
                            if(response.data){
                                window.alert("Contraseña cambiada correctamente");
                                window.location.href = "/"
                            }
                        }
                    }
                )
            }

        }
    }
});