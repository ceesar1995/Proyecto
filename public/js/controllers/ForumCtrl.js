// public/js/controllers/ForumCtrl.js
var app = angular.module('ForumCtrl', ['homeDirectives','ApiService','SelectService','ui.bootstrap','ngAnimate','ngTouch','AnnouncementService','ModalService']);

app.controller('ForumController', function($scope,$log,$http,$localStorage,ApiService,$location,$uibModal,ModalService,$route) {


    $scope.teamName = $localStorage.currentTeam.team_name;

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
                setPaginator($scope.messages,1);

            }
        );
    };

    $scope.loadMessagesForum();


    $scope.sendMessage = function (invalid) {
        $scope.submittedMessage = true;
        if(!invalid){
            $scope.message.date = new Date();
            $scope.message.idUser = $localStorage.currentUser.user_id;
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
                                    $scope.loadMessagesForum();
                                    $scope.message = {
                                        date: null,
                                        text: "",
                                        subject:""
                                    };
                                    $scope.submittedMessage = false;
                                }
                            }
                        )
                    }
                }
            )
        }

    }

    $scope.search = function () {
        $location.path("/search");
        $route.reload();
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
                setPaginator($scope.messagesAnnouncement,1);
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
                setPaginator($scope.messagesTeamReceived,1);
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
                setPaginator($scope.messagesTeamSent,1);
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

    //PAGINATOR
    var setPaginator = function (messages,firstPage) {
        $scope.totalItemsM = messages.length;
        $scope.currentPage = firstPage;
    }

});

app.controller('PlayersTeamController', function($scope,$compile,$http,$localStorage,ApiService,SelectService,$uibModal,$log,ModalService) {

    ApiService.getPlayersTeam($localStorage.currentTeam.team_id).then(
        function (response) {

            $scope.players = response.data;
            for(var i = 0;i<$scope.players.length;i++){
                $scope.players[i].provinces = SelectService.getNamesByIds($scope.players[i].province);
            }
            console.log($scope.players);
            $scope.totalItems = $scope.players.length;
            $scope.currentPage = 1;
        }
    );

    $scope.showDetails = function (player) {

        var data = {
            player: function () {
                return player;
            },
            privileges: function () {
                return $scope.privileges.privileges;
            }
        };

        var modalInstance = $uibModal.open(ModalService.createModal(true, 'views/modals/detailsPlayerModal.html', 'ModalDetailsPlayerCtrl','lg', data));
        modalInstance.result.then(function (playerModified) {
            console.log("CONFIRMADO");
            if(playerModified){
                ApiService.updatePlayerTeam($localStorage.currentTeam.team_id,player._id,{privileges:true});
            }

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    }
});
app.controller('SearchController', function($scope,$localStorage,ApiService,SelectService,$log,$uibModal,ModalService) {

    $scope.players = [];
    var lastPlayerShow = null;
    var lastTeamShow = null;


    $scope.search = function () {
        //$location.path("/search");
        $scope.searchPlayers();
        $scope.searchTeams();
    }

    $scope.searchPlayers = function () {


        if($scope.searchForm && $scope.searchForm.length>2){
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
                $scope.errorMessage = "No se encontraron jugadores";


                setPaginator($scope.players,1);

            });
        }
        else{
            $scope.totalItems = 0;
            $scope.errorMessage = "No se pudo realizar la busqueda. El campo de busqueda debe ser de al menos 3 letras.";
        }

    };


    $scope.searchTeams = function () {
        if($scope.searchForm && $scope.searchForm.length>2){
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
                $scope.errorMessage = "No se encontraron equipos";

                setPaginator($scope.teams,1);
            });
        }
        else{
            $scope.totalItems = 0;
            $scope.errorMessage = "No se pudo realizar la busqueda. El campo de busqueda debe ser de al menos 3 letras.";
        }
    };

    $scope.showBtTeam = function (team) {
        if($scope.privileges.privileges){
            team.show = !team.show;
        }
    };


    var resetShow = function (varShow) {
        if(varShow){
            varShow.show = false;
            varShow = null;
        }
    };

    $scope.searchTeams();

    $scope.sendMessageTeam = function (team) {
        if(team._id == $localStorage.currentTeam.team_id){
            window.alert("No puedes enviar un mensaje a tu propio equipo")
        }
        else{
            team.submittedMessage = true;
            if(team.text){
                var message = {};
                message.date = new Date();
                message.subject = team.subject;
                message.text = team.text;
                message.idUser = $localStorage.currentUser.user_id;
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
                                        window.alert("Mensaje enviado con exito");
                                        team.show = false;
                                        team.submittedMessage = false;
                                        team.subject = null;
                                        team.text = null;
                                        console.log(responseMessageTeam.data);
                                    }
                                }
                            )
                        }
                    }
                )
            }

        };
    }
    $scope.sendMessagePlayer = function (player) {
        player.submittedMessage = true;
        if(player.text){
            console.log(player);
            var message = {};
            message.date = new Date();
            message.subject = player.subject;
            message.text = player.text;
            message.idUser = $localStorage.currentUser.user_id;
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
                                    player.show = false;
                                    player.submittedMessage = false;
                                    player.subject = null;
                                    player.text = null;
                                    window.alert("Mensaje enviado con exito");
                                    console.log(responseMessagePlayer.data);
                                }
                            }
                        )
                    }
                }
            )
        }
    }


    $scope.joinTeam = function (team) {
        var modalInstance;
        if(!team.private){
           var data = {
               data: function () {
                   return 'Vas a unirte a este equipo¿Estás seguro?';
               }
           };
           modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
           modalInstance.result.then(function () {
               console.log("CONFIRMADO");
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

    };

    var joinTeamPublic = function (team) {
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
                    else{
                        window.alert("Tu jugador ya esta unido a este equipo.");
                    }
                }
            }
        )
    }
    var joinTeamPrivate = function (team,password) {
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
                            function (response) {
                                if(response.data==null){
                                    window.alert("Contraseña incorrecta");
                                }
                            }
                        );
                    }
                    else if(responsePlayerTeam.data.active == false){
                        ApiService.updatePlayerTeam(team._id,playerId,{active:true,password: password}).then(
                            function (response) {
                                if(response.data==null){
                                    window.alert("Contraseña incorrecta");
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
    //PAGINATOR
    var setPaginator = function (searchData,firstPage) {
        $scope.totalItems = searchData.length;
        $scope.currentPage = firstPage;
    }

});

app.controller('CreateMatchController', function ($scope,$uibModal, $log,$localStorage,ApiService,SelectService,AnnouncementService,ModalService,$filter) {


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


    $scope.createMatch = function (invalid) {
        $scope.submittedMatch = true;
        if(!invalid){
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
    }
    var createMatch = function () {

        var valid = true;
        setDatesMatch();

        $scope.match.idTeamHome = $localStorage.currentTeam.team_id;
        $scope.match.dateCreated = new Date();
        $scope.match.confirmed = false;
        if($ctrl.selectedTeam != undefined){
            if($ctrl.selectedTeam._id == $localStorage.currentTeam.team_id){
                window.alert("No puedes crear un partido contra tu propio equipo");
                valid = false;
            }
            else{
                $scope.match.idTeamGuest = $ctrl.selectedTeam._id;
            }
        }
        if(valid){
            ApiService.createMatch($scope.match).then(
                function (responseMatch) {
                    console.log(responseMatch.data);
                    if(responseMatch.statusText=="OK"){
                        resetMatch();
                        window.alert("Partido creado con éxito");
                        if($ctrl.selectedTeam != undefined) {
                            var date = $filter('date')($scope.match.dateBegin,'d/M/yy HH:mm');
                            AnnouncementService.createAnnouncement("Invitacion recibida de ",responseMatch.data,$ctrl.selectedTeam._id,$localStorage.currentTeam.team_name,date);
                        }
                    }
                });
        }

    }

    var resetMatch = function () {
        $scope.submittedMatch = true;
        $scope.match = {
            dateBegin : new Date(),
            dateEnd : null,
            place : "",
            rules : "",
            province: null

        };
        $ctrl.selectedTeam = null;
        $scope.timeBegin= null;
        $scope.timeEnd = null;
    }
});

app.controller('PendingMatchesController', function($scope,$localStorage,ApiService,AnnouncementService,$uibModal,ModalService,$log,$filter) {

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
                }
                setPaginator($scope.matchesSent,1);
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
                }
                setPaginator($scope.matchesReceived,1);
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
        var date = $filter('date')(new Date(),'d/M/yy HH:mm');
        AnnouncementService.createAnnouncementCancelled("Partido cancelado por ",match.idTeam,$localStorage.currentTeam.team_name,date);
        AnnouncementService.createAnnouncementCancelled("Partico cancelado contra ",$localStorage.currentTeam.team_id,match.name,date);
        match.rejected = true;
    };


    var confirm = function (match) {
        console.log("Confirm");
        console.log(match);
        ApiService.updateMatch(match._id,{confirmed:true});
        //createAnnouncements(match);
        var date = $filter('date')(match.dateBegin,'d/M/yy HH:mm');
        AnnouncementService.createAnnouncementsConfirmed(match,$localStorage.currentTeam.team_id,$localStorage.currentTeam.team_name,date);
        match.confirmed = true;

    };

    $scope.showBtSent = function (match) {
       return (!match.rejected && $scope.privileges.privileges);
    };
    $scope.showBtReceived = function (match) {
        return (!match.rejected && !match.confirmed && $scope.privileges.privileges);
    };

    //PAGINATOR
    var setPaginator = function (pendingMatches,firstPage) {
        $scope.totalItems = pendingMatches.length;
        $scope.currentPage = firstPage;
    }
});

app.controller('NextMatchesController', function($scope,$localStorage,ApiService,$uibModal, $log,ModalService,AnnouncementService,$filter) {

    $scope.nextMatches = [];
    var teamId = $localStorage.currentTeam.team_id;
    var teamName = $localStorage.currentTeam.team_name;

    $scope.loadNextMatches = function () {
        console.log(teamId);
        $scope.nextMatches = [];
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
                        $scope.nextMatches.push(nextMatches[i]);
                    }
                }
                $scope.totalItems = $scope.nextMatches.length;
                $scope.currentPage = 1;
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

    $scope.cancel = function (match) {
        var msg="Vas a cancelar el partido contra "+ match.name + " ¿Estás seguro?";
        var data = {
            data: function () {
                return msg;
            }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
        modalInstance.result.then(function () {
            console.log("CONFIRMADO");
            cancel(match);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    }
    var cancel = function (match) {
        console.log("PARTIDO CANCELADO");
        ApiService.updateMatch(match._id,{rejected:true}).then(
            function (response) {
                if(response.statusText=="OK"){
                    $scope.loadNextMatches();
                }
            }
        );
        var date = $filter('date')(new Date(),'d/M/yy HH:mm');
        AnnouncementService.createAnnouncementCancelled("Partido cancelado por ",match.idRivalTeam,$localStorage.currentTeam.team_name,date);
        AnnouncementService.createAnnouncementCancelled("Partico cancelado contra ",$localStorage.currentTeam.team_id,match.name,date);
    }

    $scope.showBt = function () {
        return $scope.privileges.privileges;
    }

});

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
                $scope.totalItems = $scope.previousMatches.length;
                $scope.currentPage = 1;
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

app.controller('EditDataController', function($scope,$localStorage,ApiService,SelectService,ModalService,$log,$uibModal,$timeout) {

    $scope.user = {};
    $scope.user.password="";
    $scope.player = {};
    $scope.team = {};
    $scope.provinces = SelectService.getProvinces();
    $scope.dateBorn = new Date();

    var userId = $localStorage.currentUser.user_id;
    var teamId = $localStorage.currentTeam.team_id;
    var playerId = $localStorage.currentPlayer.player_id;
    var nameTeam = $localStorage.currentTeam.team_name;

    ApiService.getUser(userId).then(
        function (userResponse) {
            if(userResponse.statusText == "OK"){
                $scope.user = userResponse.data;
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

    $scope.save = function (dataType,invalid) {
        switch (dataType){
            case 0:
                $scope.submittedUser = true;
                break;
            case 1:
                $scope.submittedPlayer = true;
                break;
            case 2:
                $scope.submittedTeam = true;
                break;


        }
        if(!invalid){
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
        if($scope.team.name != nameTeam){
            ApiService.getTeamByName($scope.team.name).then(
                function (response){
                    if(response.statusText=="OK"){
                        if(response.data){
                            $scope.popoverOpen = true;
                            $timeout(popOverOff,2000);

                        }
                        else{
                            ApiService.updateTeam(teamId,$scope.team);
                        }
                    }
                }

            )

        }
        else{
            ApiService.updateTeam(teamId,$scope.team);
        }
    }
    function popOverOff() {
        $scope.popoverOpen = false;
    }


});

app.controller('CreateTeamController', function ($scope,$localStorage,ApiService,SelectService,$timeout,$log,$uibModal,ModalService) {



    $scope.provinces = SelectService.getProvinces();

    $scope.team = {
        name:'',
        province:null,
        dateCreated: null,
    }

    $scope.createTeam = function (invalid) {
        $scope.submittedTeam = true;
        if(!invalid){
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

    }

    var createTeam = function () {
        ApiService.getTeamByName($scope.team.name).then(
            function (response) {
                if(response.statusText="OK"){
                    if(response.data){
                        $scope.popoverOpen = true;
                        $timeout(popOverOff,2000);
                    }
                    else{
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
                                        active : true,
                                        password: $scope.team.password
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
                }
            }
        )

    }
    function sendHome () {
        window.location.href = "/views/home.html"
    };
    function popOverOff() {
        $scope.popoverOpen = false;
    }
});

app.controller('MessagesController', function ($scope,$localStorage,ApiService,$log,$uibModal,ModalService) {


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
                setPaginator($scope.messagesSent,1);
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
                setPaginator($scope.messagesReceived,1);

            }
        );
    };

    $scope.loadMessagesReceived();

    $scope.deleteMessage = function (message,typeMessage) {
        var msg="Vas a eliminar el mensaje ¿Estás seguro?";
        var data = {
            data: function () {
                return msg;
            }
        };
        var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
        modalInstance.result.then(function () {
            console.log("CONFIRMADO");
            switch (typeMessage){
                case 0: deleteMessageReceived(message);
                        break;

                case 1: deleteMessageSent(message);
                        break;
            }

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    var deleteMessageReceived = function (message) {
        ApiService.updateMessagePlayer(message._id,{deletedRec:true});
        $scope.loadMessagesReceived();
    };
    var deleteMessageSent = function (message) {
        ApiService.updateMessagePlayer(message._id,{deletedRem:true});
        $scope.loadMessagesSent();
    };

    //PAGINATOR
    var setPaginator = function (messages,firstPage) {
        $scope.totalItems = messages.length;
        $scope.currentPage = firstPage;
    }

});

app.controller('SearchMatchController', function ($scope,$localStorage,ApiService,SelectService,AnnouncementService,$uibModal, $log,ModalService,$filter) {

     $scope.submittedMatch =false;

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
    
    $scope.search = function (invalid) {

        $scope.submittedMatch = true;

        if(!invalid){
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
                            match = matches[i];
                            match.teamName = responseMatches.data.teams[i].name;
                            match.provinceName = SelectService.getNameById(match.province);
                            $scope.matches.push(match);
                        }
                        $scope.totalItems = matches.length;
                        $scope.currentPage = 1;

                    }
                }
            )
        }

    }

    $scope.showBt = function () {
        return $scope.privileges.privileges;
    }

    $scope.accept = function (match) {
        if(match.idTeamHome == $localStorage.currentTeam.team_id){
            window.alert("No puedes aceptar un partido contra tu propio equipo.");
        }
        else{
            var msg="Vas a aceptar y confirmar el partido contra"+ match.teamName + " ¿Estás seguro?";
            var data = {
                data: function () {
                    return msg;
                }
            };
            var modalInstance = $uibModal.open(ModalService.createModal(true,'views/modals/confirmModal.html','ModalInstanceConfirmCtrl','sm',data));
            modalInstance.result.then(function () {
                console.log("CONFIRMADO");
                accept(match);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

    }
    var accept = function (match) {
        console.log("PARTIDO ACEPTADO");
        ApiService.updateMatch(match._id,{idTeamGuest:$localStorage.currentTeam.team_id,confirmed:true});
        var date = $filter('date')(match.dateBegin,'d/M/yy HH:mm');
        AnnouncementService.createAnnouncement("Invitacion aceptada por ",match,match.idTeamHome,$localStorage.currentTeam.team_name,date);
        AnnouncementService.createAnnouncement("Invitacion aceptada de ",match,$localStorage.currentTeam.team_id,match.teamName,date);
    }

});
