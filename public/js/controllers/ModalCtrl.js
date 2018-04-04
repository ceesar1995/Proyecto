// public/js/controllers/ModalCtrl.js
var app = angular.module('ModalCtrl', ['homeDirectives','ApiService','SelectService','ui.bootstrap','ngAnimate','ngTouch']);

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
app.controller('ModalInstanceConfirmCtrl', function ($uibModalInstance,data) {

    var $ctrl = this;

    $ctrl.data = data;
    $ctrl.ok = function () {
        $uibModalInstance.close();
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});