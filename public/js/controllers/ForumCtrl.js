// public/js/controllers/ForumCtrl.js
var app = angular.module('ForumCtrl', ['homeDirectives','ApiService','SelectService','ui.bootstrap','ngAnimate','ngTouch']);

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

    ApiService.getPrivilegesPlayerId( $localStorage.currentPlayer.player_id, $localStorage.currentTeam.team_id).then(function (respond) {
        if(respond.statusText=="OK"){
            $scope.privileges = respond.data;
        }
    });


    ApiService.getMessagesForum($localStorage.currentTeam.team_id).then(
        function (response) {
            console.log(response.data);
            $scope.messages = response.data.messages.reverse();
            $scope.players = response.data.players.reverse();
            for(var i = 0;i<$scope.messages.length;i++){
                $scope.messages[i].player = $scope.players[i][0].name;
            }
            console.log($scope.messages);
            console.log($scope.privileges);

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

app.controller('CreateMatchController', function ($scope,$uibModal, $log,$localStorage,ApiService) {


    $scope.match = {
        dateBegin : new Date(),
        dateEnd : null,
        place : "",
        rules : "",
    };



    //Functions and parameters datePopupPicker
    $scope.clear = function() {
        $scope.match.dateBegin = null;
    };

    $scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.match.dateBegin = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.imprimir = function () {
        console.log($scope.match);
        console.log($ctrl.selectedTeam.name);
        console.log($scope.timeBegin);
        console.log($scope.timeEnd);
    }


    //Functions and parameters modal
    var $ctrl = this;


    $ctrl.animationsEnabled = true;

    $ctrl.open = function (size) {
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views/modals/searchTeamModal.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: size,
            resolve: {
                teams: function () {
                    return $ctrl.teams;
                }
            }
        });

        modalInstance.result.then(function (selectedTeam) {
            $ctrl.selectedTeam = selectedTeam;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };



    //Times
    $scope.timeBegin = new Date();
    $scope.timeEnd = null;

    var setDatesMatch = function () {
        //Set dates begin and end
        $scope.match.dateBegin.setHours($scope.timeBegin.getHours());
        $scope.match.dateBegin.setMinutes($scope.timeBegin.getMinutes());
        if($scope.timeEnd){
            $scope.match.dateEnd = new Date();
            $scope.match.dateEnd.setDate($scope.match.dateBegin.getDate());
            $scope.match.dateEnd.setHours($scope.timeEnd.getHours());
            $scope.match.dateEnd.setMinutes($scope.timeEnd.getMinutes());
        }
    }

    var createMatchTeam = function (responseMatch) {
        var matchTeam = {};
        matchTeam.idMatch = responseMatch.data._id;
        matchTeam.idTeamHome = $localStorage.currentTeam.team_id;
        matchTeam.idTeamGuest = $ctrl.selectedTeam._id;
        matchTeam.dateCreated = new Date();
        matchTeam.confirmed = false;

        return matchTeam;
    }

    $scope.createMatch = function () {

        setDatesMatch();

        ApiService.createMatch($scope.match).then(
            function (responseMatch) {
                console.log(responseMatch.data);
                if(responseMatch.statusText=="OK"){
                    ApiService.createMatchTeam(createMatchTeam(responseMatch)).then(
                        function (responseMatchTeam) {
                            if(responseMatchTeam.statusText=="OK"){
                                console.log(responseMatchTeam.data);
                            }
                        }
                    )
                }
            }
        )
    }

});

app.controller('ModalInstanceCtrl', function ($uibModalInstance,ApiService,SelectService) {
    var $ctrl = this;

    $ctrl.provinces = SelectService.getProvinces();

    $ctrl.teams = [];

    $ctrl.team = {
        name:'',
        province:null
    };

    $ctrl.selectedTeam = {
        team: $ctrl.teams[0]
    };

    $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.selectedTeam.team);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $ctrl.searchTeam = function () {
        ApiService.findTeamsByName($ctrl.team.name).then(function (teamsRespond) {
            if(teamsRespond.statusText=="OK"){
                $ctrl.teams = teamsRespond.data;
                for(var i = 0;i<$ctrl.teams.length;i++){
                    $ctrl.teams[i].provinces = SelectService.getNamesByIds($ctrl.teams[i].province);
                }
                console.log($ctrl.teams);
            }
        });
    };
    $ctrl.selectTeam = function (team) {
        $ctrl.selectedTeam.team = team;
    };

});

// Please note that the close and dismiss bindings are from $uibModalInstance.

app.component('modalComponent', {
    templateUrl: 'views/modals/searchTeamModal.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function () {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.teams = [];
            $ctrl.selectedTeam = {
                team: $ctrl.teams[0]
            };
        };

        $ctrl.ok = function () {
            $ctrl.close({$value: $ctrl.selectedTeam.team});
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };
    }
});

app.controller('PendingMatchesController', function($scope,$localStorage,ApiService) {

    $scope.matchesSent = [];
    $scope.matchesReceived = [];
    var teamId = $localStorage.currentTeam.team_id;
    console.log($scope.privileges);

    $scope.loadInvitationsSent = function () {

        ApiService.getInvitationMatchesSent(teamId).then(function (response) {
            if(response.statusText=="OK"){
                console.log(response.data);
                $scope.matchesSent = response.data.matches;
                for(var i = 0; i<$scope.matchesSent.length;i++){
                    $scope.matchesSent[i].name = response.data.teams[i].name;
                    $scope.matchesSent[i].dateCreated = response.data.matchesTeam[i].dateCreated;
                    $scope.matchesSent[i].rejected = response.data.matchesTeam[i].rejected;
                }
                console.log($scope.matchesSent);
            }
        });
    };

    $scope.loadInvitationsSent();

    $scope.loadInvitationsReceived = function () {

        ApiService.getInvitationMatchesReceived(teamId).then(function (response) {
            if(response.statusText=="OK"){
                console.log(response.data);
                $scope.matchesReceived = response.data.matches;
                for(var i = 0; i<$scope.matchesReceived.length;i++){
                    $scope.matchesReceived[i].name = response.data.teams[i].name;
                    $scope.matchesReceived[i].dateCreated = response.data.matchesTeam[i].dateCreated;
                    $scope.matchesReceived[i].rejected = response.data.matchesTeam[i].rejected;
                    $scope.matchesReceived[i].confirmed = response.data.matchesTeam[i].confirmed;
                }
            }
        });
    };

    $scope.cancel = function (match) {
        console.log("Cancel");
        console.log(match);
        ApiService.updateMatchTeam(match._id,{rejected:true});
        match.rejected = true;
    };

    $scope.reject = function (match) {
        console.log("Reject");
        console.log(match);
        ApiService.updateMatchTeam(match._id,{rejected:true});
        match.rejected = true;
    };

    $scope.confirm = function (match) {
        console.log("Confirm");
        console.log(match);
        ApiService.updateMatchTeam(match._id,{confirmed:true});
        match.confirmed = true;
    };

    $scope.showBtSent = function (match) {
       return (!match.rejected && $scope.privileges.privileges);
    };
    $scope.showBtReceived = function (match) {
        return (!match.rejected && !match.confirmed && $scope.privileges.privileges);
    };
});