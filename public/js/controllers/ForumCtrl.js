// public/js/controllers/ForumCtrl.js
var app = angular.module('ForumCtrl', ['homeDirectives','ApiService','SelectService','ui.bootstrap','ngAnimate','ngTouch','AnnouncementService','ModalService']);

app.controller('ForumController', function($scope,$log,$http,$localStorage,ApiService,$location,$uibModal,ModalService) {

    $scope.searchForm = "";

    $scope.errorMessage = "";

    $scope.username = $localStorage.currentUser.username;

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

    $scope.coordinator = $localStorage.currentPlayer.player_coordinator;

    $scope.loadMessagesForum = function () {

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
    };

    $scope.loadMessagesForum();

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
                                /*
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
                                */
                                $scope.loadMessagesForum();
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

    /*
    $scope.search = function () {
        $location.path("/search");
        ApiService.findTeamsByName($scope.searchForm).then(function (teamsResponse) {
            console.log(teamsResponse.data);
            $scope.teams = teamsResponse.data;
            for(var i = 0;i<$scope.teams.length;i++){
                $scope.teams[i].provinces = SelectService.getNamesByIds($scope.teams[i].province);
                $scope.teams[i].show = false;
            }
        });
        if($scope.teams.length===0){
            $scope.errorMessage = "No se encontraron equipos";
        }
    }
    */
    $scope.search = function () {
        $location.path("/search");
    }

    $scope.logOut = function () {
        $localStorage.$reset();
        $http.defaults.headers.common.Authorization = "";
        window.location.href = "/";
    }

    $scope.dropOut = function () {
        var data = {
            data: function () {
                return 'Vas a dejar de formar parte del equipo¿Estás seguro?';
            }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
        modalInstance.result.then(function () {
            console.log("CONFIRMADO");
            dropOut();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    var dropOut = function () {
        ApiService.updatePlayerTeam($localStorage.currentTeam.team_id,$localStorage.currentPlayer.player_id,{active:false});
        $scope.logOut();
    }

    $scope.loadMessagesAnnouncement = function () {
        ApiService.getMessagesAnnouncement($localStorage.currentTeam.team_id).then(
            function (response) {
                console.log(response.data);
                $scope.messagesAnnouncement = response.data.reverse();
                for(var i = 0;i<$scope.messagesAnnouncement.length;i++){
                    $scope.messagesAnnouncement[i].player = "AVISO";
                }
                console.log($scope.messagesAnnouncement);

            }
        );
    };

    $scope.loadMessagesTeamReceived = function () {
        ApiService.getMessagesTeamReceived($localStorage.currentTeam.team_id).then(
            function (response) {
                console.log(response.data);
                $scope.messagesTeamReceived = response.data.messages.reverse();
                $scope.teams = response.data.teams.reverse();
                for(var i = 0;i<$scope.messagesTeamReceived.length;i++){
                    $scope.messagesTeamReceived[i].player = $scope.teams[i][0].name;
                }
                console.log($scope.messagesTeamReceived);

            }
        );
    };

    $scope.loadMessagesTeamSent = function () {
        ApiService.getMessagesTeamSent($localStorage.currentTeam.team_id).then(
            function (response) {
                console.log(response.data);
                $scope.messagesTeamSent = response.data.messages.reverse();
                $scope.teams = response.data.teams.reverse();
                for(var i = 0;i<$scope.messagesTeamSent.length;i++){
                    $scope.messagesTeamSent[i].player = $scope.teams[i][0].name;
                }
                console.log($scope.messagesTeamSent);

            }
        );
    };

    $scope.deleteMessage = function (message,typeMessage) {
        var data = {
            data: function () {
                return 'Vas a eliminar el mensaje¿Estás seguro?';
            }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
        modalInstance.result.then(function () {
            console.log("CONFIRMADO");
            switch (typeMessage){
                case 0:
                    deleteMessageForum(message);
                    break;
                case 1:
                    deleteMessageTeamSent(message);
                    break;
                case 2:
                    deleteMessageTeamReceived(message);
                    break;
                case 3:
                    deleteMessageAnnouncement(message);
                    break;

            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });


    }
    var deleteMessageForum = function (message) {
        ApiService.updateMessage(message._id,{deleted:true});
        ApiService.updateMessageForum(message._id,{deleted:true});
        $scope.loadMessagesForum();
    }
    var deleteMessageTeamSent = function (message) {
        ApiService.updateMessageTeam(message._id,{deletedRem:true});
        $scope.loadMessagesTeamSent();
    };
    var deleteMessageTeamReceived = function (message) {
        ApiService.updateMessageTeam(message._id,{deletedRec:true});
        $scope.loadMessagesTeamReceived();
    };
    var deleteMessageAnnouncement= function (message) {
        ApiService.updateMessage(message._id,{deleted:true});
        ApiService.updateMessageAnnouncement(message._id,$localStorage.currentTeam.team_id,{deleted:true});
        $scope.loadMessagesAnnouncement();
    };

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
app.controller('SearchController', function($scope,$localStorage,ApiService,SelectService,$log,$uibModal,ModalService) {

    $scope.players = [];
    var lastPlayerShow = null;
    var lastTeamShow = null;

    $scope.searchPlayers = function () {

        resetShow(lastTeamShow);

        $scope.teams = [];

        ApiService.findPlayersByName($scope.searchForm).then(function (response) {
            console.log(response.data);
            $scope.players = response.data.players;
            var teamNumbers = response.data.teamNumber;
            var teams = response.data.teams;
            for(var i = 0;i<$scope.players.length;i++){
                $scope.players[i].provinces = SelectService.getNamesByIds($scope.players[i].province);
                $scope.players[i].show = false;
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

        resetShow(lastPlayerShow);
        var team = {
            name: $scope.searchForm,
            province:[]
        }
        console.log(team);
        ApiService.findTeams(team).then(function (teamsResponse) {
            console.log(teamsResponse.data);
            $scope.teams = teamsResponse.data;
            for(var i = 0;i<$scope.teams.length;i++){
                $scope.teams[i].provinces = SelectService.getNamesByIds($scope.teams[i].province);
                $scope.teams[i].show = false;
            }
            if($scope.teams.length ===0){
                $scope.errorMessage = "No se encontraron equipos";
            }
            else{
                $scope.errorMessage = "";
            }
        });
    };

    $scope.showBtTeam = function (team) {
        if($scope.privileges.privileges){
            team.show = !team.show;
        }
    };
    /*
    $scope.showBtPlayer = function (player) {
        if(lastPlayerShow){
            if(lastPlayerShow == player){
                player.show = !player.show;
            }
            else{
                lastPlayerShow.show = false;
                lastPlayerShow = player;
                player.show = true;
            }
        }
        else{
            lastPlayerShow = player;
            player.show = true;
        }

    };
    */

    var resetShow = function (varShow) {
        if(varShow){
            varShow.show = false;
            varShow = null;
        }
    };

    $scope.searchTeams();

    $scope.sendMessageTeam = function (team) {
        var message = {};
        message.date = new Date();
        message.subject = team.subject;
        message.text = team.text;
        ApiService.createMessage(message).then(
            function (responseMessage) {
                if(responseMessage.statusText=="OK"){
                    var messageTeamToTeam = {};
                    messageTeamToTeam.idMessage = responseMessage.data._id;
                    messageTeamToTeam.idTeamRem = $localStorage.currentTeam.team_id;
                    messageTeamToTeam.idTeamRec = team._id;
                    ApiService.sendMessageTeam(messageTeamToTeam).then(
                        function (responseMessageTeam) {
                            if(responseMessageTeam.statusText=="OK"){
                                console.log(responseMessageTeam.data);
                            }
                        }
                    )
                }
            }
        )
    };
    $scope.sendMessagePlayer = function (player) {
        console.log(player);
        var message = {};
        message.date = new Date();
        message.subject = player.subject;
        message.text = player.text;
        ApiService.createMessage(message).then(
            function (responseMessage) {
                if(responseMessage.statusText=="OK"){
                    var messagePlayerToPlayer = {};
                    messagePlayerToPlayer.idMessage = responseMessage.data._id;
                    messagePlayerToPlayer.idPlayerRem = $localStorage.currentPlayer.player_id;
                    messagePlayerToPlayer.idPlayerRec = player._id;
                    ApiService.sendMessagePlayer(messagePlayerToPlayer).then(
                        function (responseMessagePlayer) {
                            if(responseMessagePlayer.statusText=="OK"){
                                console.log(responseMessagePlayer.data);
                            }
                        }
                    )
                }
            }
        )
    }
    
    $scope.joinTeam = function (team) {
        var data = {
            data: function () {
                return 'Vas a unirte a este equipo¿Estás seguro?';
            }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
        modalInstance.result.then(function () {
            console.log("CONFIRMADO");
            joinTeam(team);

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    };

    var joinTeam = function (team) {
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
                        ApiService.addPlayerToTeam(playerTeamData);
                    }
                    else if(responsePlayerTeam.data.active == false){
                        ApiService.updatePlayerTeam(team._id,playerId,{active:true});
                    }
                }
            }
        )
    }
});

app.controller('CreateMatchController', function ($scope,$uibModal, $log,$localStorage,ApiService,SelectService,AnnouncementService,ModalService) {


    $scope.match = {
        dateBegin : new Date(),
        dateEnd : null,
        place : "",
        rules : "",
        province: null
    };

    $scope.provinces = SelectService.getProvinces();

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


    $ctrl.open = function () {
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/searchTeamModal.html','ModalInstanceSearchTeamCtrl'));
            /*$uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views/modals/searchTeamModal.html',
            controller: 'ModalInstanceSearchTeamCtrl',
            controllerAs: '$ctrl',
            size: size,
            resolve: {

            }
        });*/

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
        if($ctrl.selectedTeam != undefined){
            matchTeam.idTeamGuest = $ctrl.selectedTeam._id;
        }
        matchTeam.dateCreated = new Date();
        matchTeam.confirmed = false;

        return matchTeam;
    }

    $scope.createMatch2 = function () {

        $scope.confirm();
        /*
        setDatesMatch();

        $scope.match.idTeamHome = $localStorage.currentTeam.team_id;
        if($ctrl.selectedTeam != undefined){
            $scope.match.idTeamGuest = $ctrl.selectedTeam._id;
        }
        $scope.match.dateCreated = new Date();
        $scope.match.confirmed = false;

        ApiService.createMatch($scope.match).then(
            function (responseMatch) {
                console.log(responseMatch.data);
                if(responseMatch.statusText=="OK"){
                    if($ctrl.selectedTeam != undefined) {
                        AnnouncementService.createAnnouncement("Invitacion recibida de ",responseMatch.data,$ctrl.selectedTeam._id,$localStorage.currentTeam.team_name);
                        //createAnnouncements(responseMatch.data);
                    }
                }
            }
        )*/
    }
    var createAnnouncements = function (match) {
        var message = {};
        message.date = new Date();
        var d = new Date(match.dateBegin);
        message.subject = "Invitación recibida de " + $localStorage.currentTeam.team_name;
        message.text = "El partido se realizaría en la siguiente fecha: " + d.getDay() +"/" + d.getMonth() + " - " + d.getHours() + ":" + d.getMinutes() + " ,en el siguiente lugar: "+match.place+".";
        ApiService.createMessage(message).then(
            function (responseMessage) {
                if(responseMessage.statusText=="OK"){
                    var messageAnnouncement = {};
                    messageAnnouncement.idMessage = responseMessage.data._id;
                    messageAnnouncement.idTeam = $ctrl.selectedTeam._id;
                    ApiService.sendMessageAnnouncement(messageAnnouncement).then(
                        function (responseMessageTeam) {
                            if(responseMessageTeam.statusText=="OK"){
                                console.log(responseMessageTeam.data);
                            }
                        }
                    );

                }
            }
        )
    }


    $scope.createMatch = function () {
        var data = {
            data: function () {
                return 'Vas a crear un partido ¿Estás seguro?';
            }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
        modalInstance.result.then(function () {
            console.log("CONFIRMADO");
            createMatch();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
    var createMatch = function () {
        setDatesMatch();

        $scope.match.idTeamHome = $localStorage.currentTeam.team_id;
        if($ctrl.selectedTeam != undefined){
            $scope.match.idTeamGuest = $ctrl.selectedTeam._id;
        }
        $scope.match.dateCreated = new Date();
        $scope.match.confirmed = false;

        ApiService.createMatch($scope.match).then(
            function (responseMatch) {
                console.log(responseMatch.data);
                if(responseMatch.statusText=="OK"){
                    if($ctrl.selectedTeam != undefined) {
                        AnnouncementService.createAnnouncement("Invitacion recibida de ",responseMatch.data,$ctrl.selectedTeam._id,$localStorage.currentTeam.team_name);
                        //createAnnouncements(responseMatch.data);
                    }
                }
            });

    }
});

/*
app.controller('ModalInstanceSearchTeamCtrl', function ($uibModalInstance,ApiService,SelectService) {
    var $ctrl = this;

    $ctrl.provinces = SelectService.getProvinces();

    $ctrl.teams = [];

    $ctrl.team = {
        name:'',
        province:[]
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
        console.log($ctrl.team);
        ApiService.findTeams($ctrl.team).then(function (teamsRespond) {
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
*/
// Please note that the close and dismiss bindings are from $uibModalInstance.
/*
app.component('modalComponentSearchTeam', {
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
*/
app.controller('PendingMatchesController', function($scope,$localStorage,ApiService,AnnouncementService,$uibModal,ModalService,$log) {

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
                    if(response.data.teams[i]){
                        $scope.matchesSent[i].name = response.data.teams[i].name;
                    }
                    else{
                        $scope.matchesSent[i].name = "(Todavía no hay equipo)";
                    }
                    //$scope.matchesSent[i].dateCreated = response.data.matchesTeam[i].dateCreated;
                   // $scope.matchesSent[i].rejected = response.data.matchesTeam[i].rejected;
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
                    $scope.matchesReceived[i].idTeam = response.data.teams[i]._id;
                    //$scope.matchesReceived[i].dateCreated = response.data.matchesTeam[i].dateCreated;
                    //$scope.matchesReceived[i].rejected = response.data.matchesTeam[i].rejected;
                    //$scope.matchesReceived[i].confirmed = response.data.matchesTeam[i].confirmed;
                }
            }
        });
    };

    $scope.action = function (match,actionType) {
        var msg;
        switch (actionType){
            case 0:
                msg = "Vas a cancelar el partido¿Estás seguro?"
                break;
            case 1:
                msg = "Vas a rechazar el partido¿Estás seguro?"
                break;
            case 2:
                msg = "Vas a confirmar el partido¿Estás seguro?"
                break;


        }
        var data = {
            data: function () {
                return msg;
            }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
        modalInstance.result.then(function () {
            console.log("CONFIRMADO");
            switch (actionType){
                case 0:
                    cancel(match);
                    break;
                case 1:
                    cancel(match);
                    break;
                case 2:
                    confirm(match);
                    break;


            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    }
    var cancel = function (match) {
        console.log("Cancel");
        console.log(match);
        ApiService.updateMatch(match._id,{rejected:true});
        match.rejected = true;
    };

    /*
    var reject = function (match) {
        console.log("Reject");
        console.log(match);
        ApiService.updateMatch(match._id,{rejected:true});
        match.rejected = true;
    };*/

    var confirm = function (match) {
        console.log("Confirm");
        console.log(match);
        ApiService.updateMatch(match._id,{confirmed:true});
        //createAnnouncements(match);
        AnnouncementService.createAnnouncementsConfirmed(match,$localStorage.currentTeam.team_id,$localStorage.currentTeam.team_name);
        match.confirmed = true;

    };

    $scope.showBtSent = function (match) {
       return (!match.rejected && $scope.privileges.privileges);
    };
    $scope.showBtReceived = function (match) {
        return (!match.rejected && !match.confirmed && $scope.privileges.privileges);
    };

    var createAnnouncements = function (match) {
        var message = {};
        message.date = new Date();
        var d = new Date(match.dateBegin);
        message.subject = "Partido confirmado entre " + match.name + " - " + $localStorage.currentTeam.team_name;
        message.text = "El partido se realizara en la siguiente fecha: " + d.getDay() +"/" + d.getMonth() + " - " + d.getHours() + ":" + d.getMinutes() + " ,en el siguiente lugar: "+match.place+".";
        ApiService.createMessage(message).then(
            function (responseMessage) {
                if(responseMessage.statusText=="OK"){
                    var messageAnnouncement = {};
                    messageAnnouncement.idMessage = responseMessage.data._id;
                    messageAnnouncement.idTeam = $localStorage.currentTeam.team_id;
                    ApiService.sendMessageAnnouncement(messageAnnouncement).then(
                        function (responseMessageTeam) {
                            if(responseMessageTeam.statusText=="OK"){
                                console.log(responseMessageTeam.data);
                            }
                        }
                    );
                    messageAnnouncement.idMessage = responseMessage.data._id;
                    messageAnnouncement.idTeam = match.idTeam;
                    ApiService.sendMessageAnnouncement(messageAnnouncement).then(
                        function (responseMessageTeam) {
                            if(responseMessageTeam.statusText=="OK"){
                                console.log(responseMessageTeam.data);
                            }
                        }
                    );
                }
            }
        )
    }
});

app.controller('NextMatchesController', function($scope,$localStorage,ApiService,$uibModal, $log,ModalService) {

    $scope.nextMatches = [];
    var teamId = $localStorage.currentTeam.team_id;
    var teamName = $localStorage.currentTeam.team_name;

    $scope.loadNextMatches = function () {
        console.log(teamId);
        ApiService.getNextMatches(teamId).then(function (response) {
            if(response.statusText=="OK"){
                console.log(response.data);
                var nextMatches = response.data.matches;
                for(var i = 0; i<nextMatches.length;i++){
                    if(nextMatches[i]){
                        nextMatches[i].name = response.data.teams[i].name;
                        nextMatches[i].idRivalTeam = response.data.teams[i]._id;
                        if(teamId == nextMatches[i].idTeamHome) {
                            nextMatches[i].teamHome = teamName;
                            nextMatches[i].teamGuest = response.data.teams[i].name;
                        }
                        else{
                            nextMatches[i].teamGuest = teamName;
                            nextMatches[i].teamHome = response.data.teams[i].name;
                        }
                        //nextMatches[i].dateCreated = response.data.matchesTeam[i].dateCreated;
                        $scope.nextMatches.push(nextMatches[i]);
                    }
                }
                console.log($scope.nextMatches);
            }
        });
    };

    $scope.loadNextMatches();

    //Functions and parameters modal
    var $ctrl = this;



    $ctrl.open =  function () {
        var match = {
            match: function () {
                return $ctrl.match;
            }
         };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/summonMatchModal.html','ModalInstanceSummonMatchCtrl',null,match));

            /*{
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views/modals/summonMatchModal.html',
            controller: 'ModalInstanceSummonMatchCtrl',
            controllerAs: '$ctrl',
            resolve: {
                match: function () {
                    return $ctrl.match;
                }
            }
        });*/

        modalInstance.result.then(function (msg) {
            console.log(msg);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.showSummon = function (match) {
        $ctrl.match = match;
        $ctrl.open();
    }

});
/*
app.controller('ModalInstanceSummonMatchCtrl', function ($uibModalInstance,ApiService,match,$localStorage) {

    var $ctrl = this;

    var isMyPlayerAlreadySummoned = false;
    var myPlayerSummonedByRival = false;
    var summon = false;
    var myTeamId = $localStorage.currentTeam.team_id;
    $ctrl.myTeamName = $localStorage.currentTeam.team_name;
    $ctrl.rivalTeamName = match.name;
    $ctrl.match = match;
    $ctrl.myTeamPlayers =[];
    $ctrl.rivalTeamPlayers = [];

    $ctrl.ok = function () {
        if(summon != isMyPlayerAlreadySummoned){
            if(summon){
                var matchPlayer ={
                    idMatch: $ctrl.match._id,
                    idPlayer: $localStorage.currentPlayer.player_id,
                    idTeam: myTeamId,
                    date: new Date()
                };
                ApiService.createMatchPlayer(matchPlayer).then(
                    function (respond) {
                        if(respond.statusText = "OK"){
                            console.log(respond.data);
                        }
                });
            }
            else{
                var matchPlayer ={
                    deleted: true
                }
                ApiService.updateMatchPlayer($ctrl.match._id,$localStorage.currentPlayer.player_id,matchPlayer).then(
                    function (respond) {
                        if(respond.statusText = "OK"){
                            console.log(respond.data);
                        }
                    });
            }
        }
        $uibModalInstance.close("OK");
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    $ctrl.setButtons = function () {
        console.log("OLE"+isMyPlayerAlreadySummoned);
        if(isMyPlayerAlreadySummoned){
            $ctrl.actionBtLabel = "Desapuntar";

        }
        else{
            $ctrl.actionBtLabel = "Apuntarse";
        }
    };

    $ctrl.action = function () {
        if(isMyPlayerAlreadySummoned){
            if(myPlayerSummonedByRival){
                window.alert("Tu jugador ya esta convocado con el equipo rival");
            }else{
                console.log("ME DESAPUNTO");
                summon = false;
                $ctrl.actionBtLabel = "Apuntarse";
            }
        }
        else{
            console.log("ME APUNTO");
            summon = true;
            $ctrl.actionBtLabel = "Desapuntar";
        }
    }
    var loadPlayers = function () {

        ApiService.getPlayersSummoned($ctrl.match._id).then(
            function (response) {
                if(response.statusText=="OK"){
                    var players = response.data.players;
                    for(var i=0;i<players.length;i++){
                        if($localStorage.currentPlayer.player_id == players[i]._id){
                            isMyPlayerAlreadySummoned = true;
                            console.log("ACIERTO");
                            if(response.data.matchesPlayers[i].idTeam != myTeamId) {
                                myPlayerSummonedByRival = true;
                            }
                        }
                        else{
                            console.log("FALLO");
                        }
                        players[i].date = response.data.matchesPlayers[i].date;
                        console.log(players[i]);
                        if(response.data.matchesPlayers[i].idTeam == myTeamId) {
                            $ctrl.myTeamPlayers.push(players[i]);
                        }
                        else{
                            $ctrl.rivalTeamPlayers.push(players[i]);
                        }
                    }
                    console.log($ctrl.myTeamPlayers);
                    $ctrl.setButtons();
                }
            });
    };

    loadPlayers();





});
*/
// Please note that the close and dismiss bindings are from $uibModalInstance.
/*
app.component('modalComponentSummonMatch', {
    templateUrl: 'views/modals/summonMatchModal.html',
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
*/
app.controller('PreviousMatchesController', function($scope,$localStorage,ApiService, $uibModal,$log,ModalService) {

    $scope.previousMatches = [];
    var teamId = $localStorage.currentTeam.team_id;
    var teamName = $localStorage.currentTeam.team_name;

    $scope.loadPreviousMatches = function () {
        ApiService.getPreviousMatches(teamId).then(function (response) {
            if(response.statusText=="OK"){
                console.log(response.data);
                var previousMatches = response.data.matches;
                for(var i = 0; i<previousMatches.length;i++){
                    if(previousMatches[i]){
                        if(teamId == previousMatches[i].idTeamHome) {
                            previousMatches[i].teamHome = teamName;
                            previousMatches[i].teamGuest = response.data.teams[i].name;
                        }
                        else{
                            previousMatches[i].teamGuest = teamName;
                            previousMatches[i].teamHome = response.data.teams[i].name;
                        }
                        previousMatches[i].name = response.data.teams[i].name;
                        //previousMatches[i].dateCreated = response.data.matchesTeam[i].dateCreated;
                        $scope.previousMatches.push(previousMatches[i]);
                    }
                }
                console.log($scope.previousMatches);
            }
        });
    };

    $scope.showBt = function () {
        return $scope.privileges.privileges;
    }

    $scope.loadPreviousMatches();



    //Functions and parameters modal
    var $ctrl = this;



    $ctrl.open =  function () {
        var match = {
            match: function () {
                return $ctrl.match;
            }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/afterMatchReportModal.html','ModalInstanceAfterMatchReportCtrl','lg',match));
            /*{
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views/modals/afterMatchReportModal.html',
            controller: 'ModalInstanceAfterMatchReportCtrl',
            controllerAs: '$ctrl',
            size: 'lg',
            resolve: {
                match: function () {
                    return $ctrl.match;
                }
            }
        });*/

        modalInstance.result.then(function (msg) {
            console.log(msg);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.showAfterMatchReport = function (match) {
        $ctrl.match = match;
        $ctrl.open();
    }
});
/*
app.controller('ModalInstanceAfterMatchReportCtrl', function ($uibModalInstance,ApiService,match,$localStorage) {

    var $ctrl = this;

    var myTeamId = $localStorage.currentTeam.team_id;
    $ctrl.match = match;
    $ctrl.scoreGuest = match.scoreGuest;
    $ctrl.scoreHome = match.scoreHome;
    $ctrl.playersSummoned = [];
    $ctrl.playersNotSummoned = [];

    var playersToSave = [];
    var playersToSaveIds = [];
    var playersSummonedId = [];

    ApiService.getPlayersSummoned($ctrl.match._id).then(
        function (response) {
            if(response.statusText=="OK"){
                var players = response.data.players;
                for(var i=0;i<players.length;i++){
                    if(response.data.matchesPlayers[i].idTeam == myTeamId) {
                        if(response.data.matchesPlayers[i].summoned == true){
                            players[i].played = response.data.matchesPlayers[i].played;
                            players[i].goals = response.data.matchesPlayers[i].goals;
                            players[i].alreadyExists = true;
                            $ctrl.playersSummoned.push(players[i]);
                        }
                        playersSummonedId.push(players[i]._id);
                    }
                }
                console.log($ctrl.playersSummoned);
                ApiService.getPlayersTeam(myTeamId).then(
                    function (responsePlayers) {
                        if(responsePlayers.statusText="OK"){
                            var teamPlayers = responsePlayers.data;
                            teamPlayers.forEach(function (player) {
                                var index = playersSummonedId.indexOf(player._id);
                                if( index == -1){
                                    player.played= false;
                                    player.goals = 0;
                                    player.alreadyExists = false;
                                    $ctrl.playersNotSummoned.push(player);

                                }
                                else{
                                    console.log(response.data.matchesPlayers[index]);
                                    if(response.data.matchesPlayers[index].summoned == false){
                                        player.alreadyExists = true;
                                        player.played= response.data.matchesPlayers[index].played;
                                        player.goals = response.data.matchesPlayers[index].goals;
                                        $ctrl.playersNotSummoned.push(player);
                                    }
                                }
                            });
                            console.log($ctrl.playersNotSummoned);
                        }
                     }
                );
            }
         }
    );

    var filter = function (player) {
        if(playersSummonedId.indexOf(player._id) !== -1){
            return player;
        }
    }
    $ctrl.ok = function () {

        playersToSave.forEach(function (player) {
            if(player.alreadyExists){
                var matchPlayerData = {
                    played: player.played,
                    goals: player.goals
                }
                ApiService.updateMatchPlayer($ctrl.match._id,player._id,matchPlayerData);
            }
            else{
                var matchPlayerData ={
                    idMatch: $ctrl.match._id,
                    idPlayer: player._id,
                    idTeam: myTeamId,
                    date: new Date(),
                    played: player.played,
                    goals: player.goals,
                    summoned:false

                }
                ApiService.createMatchPlayer(matchPlayerData);
            }
        });
        if($ctrl.match.scoreHome !== $ctrl.scoreHome || $ctrl.match.scoreGuest !== $ctrl.scoreGuest){
            $ctrl.match.scoreHome = $ctrl.scoreHome;
            $ctrl.match.scoreGuest = $ctrl.scoreGuest;
            var matchData = {
                scoreHome: $ctrl.scoreHome,
                scoreGuest : $ctrl.scoreGuest
            }

            ApiService.updateMatch($ctrl.match._id,matchData);
        }
        $uibModalInstance.close(playersToSave);

    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $ctrl.save = function (player) {

        if(playersToSaveIds.indexOf(player._id) == -1){
            playersToSave.push(player);
            playersToSaveIds.push(player._id);
            console.log(player);
        }
    }
});
*/
app.controller('EditDataController', function($scope,$localStorage,ApiService,SelectService,ModalService,$log,$uibModal) {

    $scope.user = {};
    $scope.player = {};
    $scope.team = {};
    $scope.provinces = SelectService.getProvinces();
    $scope.dateBorn = new Date();

    var userId = $localStorage.currentUser.user_id;
    var teamId = $localStorage.currentTeam.team_id;
    var playerId = $localStorage.currentPlayer.player_id;

    ApiService.getUser(userId).then(
        function (userResponse) {
            if(userResponse.statusText == "OK"){
                $scope.user = userResponse.data;
                //$scope.setDate($scope.user.dateBorn.getUTCFullYear(),$scope.user.dateBorn.getMonth(),$scope.user.dateBorn.getDay());
                $scope.dateBorn = new Date($scope.user.dateBorn);
        }
    });
    ApiService.getPlayer(playerId).then(
        function (playerResponse) {
            if(playerResponse.statusText == "OK"){
                $scope.player = playerResponse.data;
            }
        }
    );

    if($scope.privileges.privileges==true){
        ApiService.getTeam(teamId).then(
            function (teamResponse) {
                if(teamResponse.statusText == "OK"){
                    $scope.team = teamResponse.data;
                }
            }
        );
    }



    $scope.clear = function() {
        $scope.dateBorn = null;
    };

    $scope.inlineOptions = {
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
        $scope.dateBorn = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.save = function (dataType) {
        var msg;
        switch (dataType){
            case 0:
                msg = "Vas a actualizar los datos de usuario¿Estás seguro?"
                break;
            case 1:
                msg = "Vas a actualizar los datos de jugador¿Estás seguro?"
                break;
            case 2:
                msg = "Vas a actualizar los datos de equipo¿Estás seguro?"
                break;


        }
        var data = {
            data: function () {
                return msg;
            }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
        modalInstance.result.then(function () {
            console.log("CONFIRMADO");
            switch (dataType){
                case 0:
                    saveUser();
                    break;
                case 1:
                    savePlayer();
                    break;
                case 2:
                    saveTeam();
                    break;


            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    }

    var saveUser = function () {
        console.log($scope.user);
        $scope.user.dateBorn = $scope.dateBorn;
        ApiService.updateUser(userId,$scope.user);
    };
    var savePlayer = function () {
        ApiService.updatePlayer(playerId,$scope.player).then(
            function (responsePlayer) {
                if(responsePlayer.statusText=="OK"){
                    $scope.coordinator = responsePlayer.coordinator;
                    $localStorage.currentPlayer.player_coordinator = responsePlayer.coordinator;
                }
        })

    };
    var saveTeam = function () {
        ApiService.updateTeam(teamId,$scope.team);
    }

});

app.controller('CreateTeamController', function ($scope,$localStorage,ApiService,SelectService,$timeout,$log,$uibModal,ModalService) {



    $scope.provinces = SelectService.getProvinces();

    $scope.team = {
        name:'',
        province:null,
        dateCreated: null,
    }

    $scope.createTeam = function () {
        var msg="Vas a crear el equipo "+ $scope.team.name + " ¿Estás seguro?";
        var data = {
            data: function () {
                return msg;
            }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
        modalInstance.result.then(function () {
            console.log("CONFIRMADO");
            createTeam();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    }

    var createTeam = function () {
        $scope.team.dateCreated = new Date();
        ApiService.createTeam($scope.team).then(
            function (responseTeam) {
                if(responseTeam.statusText=="OK"){
                    var playerTeamData ={
                        idPlayer : $localStorage.currentPlayer.player_id,
                        idTeam : responseTeam.data._id,
                        date : new Date(),
                        creator : true,
                        privileges : true,
                        active : true
                    }
                    ApiService.addPlayerToTeam(playerTeamData).then(
                        function (responsePlayerToTeam) {
                            console.log(responsePlayerToTeam.data);
                            $localStorage.currentTeam= {team_id: responsePlayerToTeam.data.idTeam,team_name:$scope.team.name};
                            $timeout(sendHome,2000);
                        }
                    )
                }
            }
        )
    }
    function sendHome () {
        window.location.href = "/views/home.html"
    };
});

app.controller('MessagesController', function ($scope,$localStorage,ApiService,SelectService,$timeout) {


    $scope.messagesReceived = [];
    $scope.messagesSent = [];

    $scope.loadMessagesSent = function () {
        ApiService.getMessagesSent($localStorage.currentPlayer.player_id).then(
            function (response) {
                console.log(response.data);
                $scope.messagesSent = response.data.messages.reverse();
                $scope.players = response.data.players.reverse();
                for(var i = 0;i<$scope.messagesSent.length;i++){
                    $scope.messagesSent[i].player = $scope.players[i][0].name;
                }
                console.log($scope.messagesSent);

            }
        );
    };
    $scope.loadMessagesReceived = function () {
        ApiService.getMessagesReceived($localStorage.currentPlayer.player_id).then(
            function (response) {
                console.log(response.data);
                $scope.messagesReceived = response.data.messages.reverse();
                $scope.players = response.data.players.reverse();
                for(var i = 0;i<$scope.messagesReceived.length;i++){
                    $scope.messagesReceived[i].player = $scope.players[i][0].name;
                }
                console.log($scope.messagesReceived);

            }
        );
    };
    ApiService.getMessagesReceived($localStorage.currentPlayer.player_id).then(
        function (response) {
            console.log(response.data);
            $scope.messagesReceived = response.data.messages.reverse();
            $scope.players = response.data.players.reverse();
            for(var i = 0;i<$scope.messagesReceived.length;i++){
                $scope.messagesReceived[i].player = $scope.players[i][0].name;
            }
            console.log($scope.messagesReceived);

        }
    );

    $scope.loadMessagesReceived();
    $scope.loadMessagesSent();

    $scope.deleteMessageReceived = function (message) {
        ApiService.updateMessagePlayer(message._id,{deletedRec:true});
        $scope.loadMessagesReceived();
    };
    $scope.deleteMessageSent = function (message) {
        ApiService.updateMessagePlayer(message._id,{deletedRem:true});
        $scope.loadMessagesSent();
    };

});

app.controller('SearchMatchController', function ($scope,$localStorage,ApiService,SelectService,AnnouncementService) {



    $scope.match = {

        place: "",
        province:[],
        dateBegin: new Date(),
        dateEnd: new Date()


    };


    $scope.matches = [];
    $scope.provinces = SelectService.getProvinces();

    $scope.inlineOptions = {
        showWeeks: true
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2025,12,31),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };
    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };


    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };
    
    $scope.search = function () {
        $scope.match.dateBegin.setUTCHours(00,00);
        $scope.match.dateEnd.setUTCHours(23,59);
        console.log($scope.match);
        $scope.matches = [];
        ApiService.findMatches($scope.match).then(
            function (responseMatches) {
                if(responseMatches.statusText=="OK"){
                    var matches = responseMatches.data.matches;
                    var match;
                    for(var i = 0;i<matches.length;i++){
                        //if(responseMatches.data.matchesTeam[i].idTeamGuest == undefined){
                            match = matches[i];
                            match.teamName = responseMatches.data.teams[i].name;
                            //match.dateCreated = responseMatches.data.matchesTeam[i].dateCreated;
                            match.provinceName = SelectService.getNameById(match.province);
                            $scope.matches.push(match);
                       // }
                    }

                }
            }
        )

    }

    $scope.showBt = function () {
        return $scope.privileges.privileges;
    }

    $scope.accept = function (match) {
        console.log("PARTIDO ACEPTADO");
        ApiService.updateMatch(match._id,{idTeamGuest:$localStorage.currentTeam.team_id});
        AnnouncementService.createAnnouncement("Invitacion aceptada por ",match,match.idTeamHome,$localStorage.currentTeam.team_name);
        AnnouncementService.createAnnouncement("Invitacion aceptada de ",match,$localStorage.currentTeam.team_id,match.teamName);
    }

});
/*
app.controller('ModalInstanceConfirmCtrl', function ($uibModalInstance,data) {

    var $ctrl = this;

    $ctrl.data = data;
    $ctrl.ok = function () {
        $uibModalInstance.close(true);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});*/