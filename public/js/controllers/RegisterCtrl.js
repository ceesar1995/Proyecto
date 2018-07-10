// public/js/controllers/RegisterCtrl.js
angular.module('RegisterCtrl', ['SelectService','ApiService','RouterService','ngStorage','ui.bootstrap','ngAnimate','ngTouch','ModalService']).controller('RegisterController', function($http,$scope,$rootScope,SelectService,ApiService,RouterService,$localStorage,$location,$timeout,$uibModal,ModalService,$log) {

    $scope.submitted = false;

    $scope.termConditions = false;

    if($localStorage.currentUser){
        $http.defaults.headers.common.Authorization =  $localStorage.currentUser.token;
    }

    $scope.user = {
        username:null,
        password:null,
        email: null,
        dateEnrolled: null,
        name: null,
        surname:null,
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
        province:[],
        dateCreated: null,
    }

    $scope.teams = [];

    if(RouterService.getSavedData()){
        $scope.player=RouterService.getSavedData();
    }

    $scope.registerUser = function(valid){
        $scope.submitted = true;
        if(!valid){
            ApiService.getUserByUsername($scope.user.username).then(
                function (responseUser) {
                    if(responseUser.statusText="OK"){
                        if(responseUser.data){
                            $scope.popoverOpen = true;
                            $timeout(turnOffPopover,2000);
                        }
                        else{
                            $scope.user.dateEnrolled = new Date();
                            var userData = $scope.user;
                            ApiService.registerUser(userData).then(
                                function (response){
                                    if(response.statusText=="OK"){
                                        var token = response.data.token;
                                        if (token) {
                                            var email = {
                                                to:userData.email,
                                                subject: "Email de bienvenida",
                                                body: "Gracias por unirte a la familia de pachangaNet"
                                            };
                                            ApiService.sendEmailWelcome(email);
                                            var id = response.data.user_id;
                                            // store username and token in local storage to keep user logged in between page refreshes
                                            $localStorage.currentUser = {user_id: id, token: token,username:userData.username};
                                            $location.path("/firstLogIn");
                                        }
                                    }
                                });
                        }

                    }
                }
            ).catch(function (error) {

            })
        }



    };

    var turnOffPopover = function () {
        $scope.popoverOpen = false;
    }

    $scope.savePlayerData = function (invalid) {
        $scope.submittedPlayer = true;

        if(!invalid){
            $scope.player.idUser = $localStorage.currentUser.user_id;
            RouterService.setSavedData($scope.player);
            if($scope.player.coordinator==true) {
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
    $scope.registerPlayerAndTeam = function (invalid) {
        $scope.submittedTeam = true;
        if(!invalid && RouterService.getSavedData()) {

            ApiService.getTeamByName($scope.team.name).then(
                function (response) {
                    if(response.statusText="OK"){
                        if(response.data){
                            $scope.popoverOpen = true;
                            $timeout(turnOffPopover,2000);
                        }
                        else{
                            registerPlayerAndTeam();
                        }
                    }
                }
            )

        }
    }

    var registerPlayerAndTeam = function () {
        ApiService.createPlayer(RouterService.getSavedData()).then(
            function (responsePlayer) {
                if (responsePlayer.statusText == "OK") {
                    $scope.team.dateCreated = new Date();
                    ApiService.createTeam($scope.team).then(
                        function (responseTeam) {
                            if (responseTeam.statusText == "OK") {
                                playerTeamData = {
                                    idPlayer: responsePlayer.data._id,
                                    idTeam: responseTeam.data._id,
                                    date: new Date(),
                                    creator: true,
                                    privileges: true,
                                    active: true,
                                    password: $scope.team.password
                                }
                                ApiService.addPlayerToTeam(playerTeamData).then(
                                    function (responsePlayerToTeam) {
                                        ApiService.updateUser($localStorage.currentUser.user_id, {idPlayer: responsePlayerToTeam.data.idPlayer}).then(function (responseUser) {
                                            $localStorage.currentTeam = {team_id: responsePlayerToTeam.data.idTeam,team_name: $scope.team.name};
                                            $localStorage.currentPlayer = {
                                                player_id: responsePlayerToTeam.data.idPlayer,
                                                player_name: responsePlayer.data.name
                                            };
                                            ApiService.updateToken().then(
                                                function (tokenUpdated) {
                                                    if(tokenUpdated.statusText="OK"){
                                                        if(tokenUpdated.data){
                                                            $localStorage.currentUser.token = tokenUpdated.data;
                                                            $timeout(sendHome,2000);
                                                        }
                                                    }
                                                }
                                            )
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
        ApiService.findTeams($scope.team).then(function (teamsRespond) {
           if(teamsRespond.statusText=="OK"){
               $scope.teams = teamsRespond.data;
               for(var i = 0;i<$scope.teams.length;i++){
                   $scope.teams[i].provinces = SelectService.getNamesByIds($scope.teams[i].province);
               }
           }
        });
    }
    $scope.selectTeam = function (team) {
        var modalInstance;
        if(!team.private){
            var data = {
                data: function () {
                    return 'Vas a unirte a este equipo¿Estás seguro?';
                }
            };
            modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
            modalInstance.result.then(function () {
                joinTeamPublic(team);

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        else{
            modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/passwordTeamModal.html','ModalPasswordTeamCtrl','sm'));
            modalInstance.result.then(function (password) {
                joinTeamPrivate(team,password);

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

    }

    var joinTeamPublic = function (team) {

        if(!$localStorage.currentPlayer){
            createPlayerAndJoinTeam(team,"");
        }
        else{
            var playerId = $localStorage.currentPlayer.player_id;
            ApiService.getPlayerTeam(team._id,playerId).then(
                function (responsePlayerTeam) {
                    if(responsePlayerTeam.statusText == "OK"){
                        if(responsePlayerTeam.data == null){
                            var playerTeamData ={
                                idPlayer : playerId,
                                idTeam : team._id,
                                date : new Date(),
                                creator : false,
                                privileges : false,
                                active : true
                            }
                            ApiService.addPlayerToTeam(playerTeamData).then(
                                function (responsePlayerToTeam) {
                                    if(responsePlayerToTeam.statusText=="OK"){
                                        $localStorage.currentTeam = {team_id: responsePlayerToTeam.data.idTeam,team_name: team.name};
                                        $timeout(sendHome,2000);
                                    }
                                }
                            );

                        }
                        else if(responsePlayerTeam.data.active == false){
                            ApiService.updatePlayerTeam(team._id,playerId,{active:true}).then(
                                function (responsePlayerToTeam) {
                                    if(responsePlayerToTeam.statusText=="OK"){
                                        $localStorage.currentTeam = {team_id: responsePlayerToTeam.data.idTeam,team_name: team.name};
                                        $timeout(sendHome,2000);
                                    }
                                }
                            );
                        }
                        else{
                            window.alert("Tu jugador ya esta unido a este equipo.");
                        }
                    }
                }
            )
        }

    }
    var joinTeamPrivate = function (team,password) {
        if(!$localStorage.currentPlayer){
            ApiService.checkTeamPassword(team._id,{password:password}).then(
                function (responsePassword) {
                    if(responsePassword.statusText="OK"){
                        if(responsePassword)
                          createPlayerAndJoinTeam(team,password);
                        else
                            window.alert("Contraseña incorrecta");
                    }
                }
            )

        }
        else{
            var playerId = $localStorage.currentPlayer.player_id;
            ApiService.getPlayerTeam(team._id,playerId).then(
                function (responsePlayerTeam) {
                    if(responsePlayerTeam.statusText == "OK"){
                        if(responsePlayerTeam.data == null){
                            var playerTeamData ={
                                idPlayer : playerId,
                                idTeam : team._id,
                                date : new Date(),
                                creator : false,
                                privileges : false,
                                active : true,
                                password: password
                            }
                            ApiService.addPlayerToTeam(playerTeamData).then(
                                function (responsePlayerToTeam) {
                                    if(responsePlayerToTeam.statusText=="OK"){
                                        $localStorage.currentTeam = {team_id: responsePlayerToTeam.data.idTeam,team_name: team.name};
                                        $timeout(sendHome,2000);
                                    }
                                }
                            )
                        }
                        else if(responsePlayerTeam.data.active == false){
                            ApiService.updatePlayerTeam(team._id,playerId,{active:true,password: password}).then(
                                function (responsePlayerToTeam) {
                                    if(responsePlayerToTeam.data==null){
                                        window.alert("Contraseña incorrecta");
                                    }
                                    else{
                                        if(responsePlayerToTeam.statusText=="OK"){
                                            $localStorage.currentTeam = {team_id: responsePlayerToTeam.data.idTeam,team_name: team.name};
                                            $timeout(sendHome,2000);
                                        }
                                    }
                                }
                            );
                        }
                        else{
                            window.alert("Tu jugador ya esta unido a este equipo.");
                        }
                    }
                }
            )
        }

    }

    var createPlayerAndJoinTeam = function (team,password) {
        ApiService.createPlayer(RouterService.getSavedData()).then(
            function (responsePlayer) {
                if (responsePlayer.statusText == "OK") {
                    var playerTeamData ={
                        idPlayer : responsePlayer.data._id,
                        idTeam : team._id,
                        date : new Date(),
                        creator : false,
                        privileges : false,
                        active : true,
                        password:password
                    };
                    ApiService.addPlayerToTeam(playerTeamData).then(
                        function (responsePlayerToTeam) {
                            ApiService.updateUser( $localStorage.currentUser.user_id,{idPlayer:responsePlayerToTeam.data.idPlayer}).then(function (responseUser) {
                                $localStorage.currentTeam = {team_id: responsePlayerToTeam.data.idTeam,team_name: team.name};
                                $localStorage.currentPlayer = {
                                    player_id: responsePlayerToTeam.data.idPlayer,
                                    player_name: responsePlayer.data.name,
                                    player_coordinator:responsePlayer.data.coordinator
                                };
                                ApiService.updateToken().then(
                                    function (tokenUpdated) {
                                        if(tokenUpdated.statusText="OK"){
                                            if(tokenUpdated.data){
                                                $localStorage.currentUser.token = tokenUpdated.data;
                                                $timeout(sendHome,2000);
                                            }
                                        }
                                    }
                                )
                            })
                        }
                    )

                }
            });
    }
    //Functions and parameters datePopupPicker
    $scope.clear = function() {
        $scope.user.dateBorn = null;
    };

    $scope.inlineOptions = {
        minDate: new Date(1920, 5, 22),
        showWeeks: true
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(1920, 5, 22),
        startingDay: 1
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.user.dateBorn = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    function sendHome () {
        window.location.href = "/home"
    }


    $scope.termsConditions = function () {
        var data = {
            data : function () {
            return 'OK';
        }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/termsConditionsModal.html','ModalInstanceConfirmCtrl','lg',data));
        modalInstance.result.then(function () {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

});
