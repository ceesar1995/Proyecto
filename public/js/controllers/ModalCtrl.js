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
        ApiService.findTeams($ctrl.team).then(function (teamsRespond) {
            if(teamsRespond.statusText=="OK"){
                $ctrl.teams = teamsRespond.data;
                for(var i = 0;i<$ctrl.teams.length;i++){
                    $ctrl.teams[i].provinces = SelectService.getNamesByIds($ctrl.teams[i].province);
                }
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
    var newSummon = false;
    var index = -1;
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
        if(isMyPlayerAlreadySummoned){
            if(myPlayerSummonedByRival){
                $ctrl.actionBtLabel = "Apuntarse";
            }
            else{
                $ctrl.actionBtLabel = "Desapuntar";
            }
            summon = true;
        }
        else{
            $ctrl.actionBtLabel = "Apuntarse";
        }
    };

    $ctrl.action = function () {
        if(isMyPlayerAlreadySummoned && summon){
            if(myPlayerSummonedByRival){
                window.alert("Tu jugador ya esta convocado con el equipo rival");
            }else{
                if(index || newSummon)
                    $ctrl.myTeamPlayers.pop();
                else
                    $ctrl.myTeamPlayers.splice(index,index+1);
                summon = false;
                $ctrl.actionBtLabel = "Apuntarse";
            }
        }
        else{
            var player = {
                name: $localStorage.currentPlayer.player_name,
                date: new Date()
            };
            $ctrl.myTeamPlayers.push(player);
            newSummon = true;
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
                            index = i;
                            isMyPlayerAlreadySummoned = true;
                            if(response.data.matchesPlayers[i].idTeam != myTeamId) {
                                myPlayerSummonedByRival = true;
                                $ctrl.rivalTeamPlayers.push(players[i]);
                            }
                            else{
                                $ctrl.myTeamPlayers.push(players[i]);
                            }
                        }
                        else{
                            if(response.data.matchesPlayers[i].idTeam != myTeamId) {
                                $ctrl.rivalTeamPlayers.push(players[i]);
                            }
                            else{
                                $ctrl.myTeamPlayers.push(players[i]);
                            }
                        }
                        players[i].date = response.data.matchesPlayers[i].date;
                    }
                    $ctrl.setButtons();
                }
            });
    };

    loadPlayers();

});
app.controller('ModalInstanceAfterMatchReportCtrl', function ($uibModalInstance,ApiService,match,$localStorage,privileges) {

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
                                    if(response.data.matchesPlayers[index].summoned == false){
                                        player.alreadyExists = true;
                                        player.played= response.data.matchesPlayers[index].played;
                                        player.goals = response.data.matchesPlayers[index].goals;
                                        $ctrl.playersNotSummoned.push(player);
                                    }
                                }
                            });
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
        }
    }

    $ctrl.showBt = function () {
        return privileges;
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
app.controller('ModalCreateOrJoinTeamCtrl', function ($uibModalInstance) {

    var $ctrl = this;

    $ctrl.ok = function (createTeam) {
        $uibModalInstance.close(createTeam);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});
app.controller('ModalPasswordTeamCtrl', function ($uibModalInstance) {

    var $ctrl = this;

    $ctrl.ok = function (invalid) {
        $ctrl.submitted = true;
        if(!invalid){
            $uibModalInstance.close($ctrl.password);
        }

    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});
app.controller('ModalDetailsPlayerCtrl', function ($uibModalInstance,player,ApiService,$localStorage,$scope,privileges) {

    var $ctrl = this;

    var modified = false;

    $ctrl.player = player;
    $ctrl.privileges = privileges;


    ApiService.getPlayerTeam($localStorage.currentTeam.team_id,player._id).then(
        function (responsePlayerTeam) {
            if(responsePlayerTeam.statusText =="OK"){
                $ctrl.playerTeam= responsePlayerTeam.data;
            }
        }
    );

    ApiService.getPlayerGoals($localStorage.currentTeam.team_id,player._id).then(
        function (responsePlayerGoals) {
            if(responsePlayerGoals.statusText =="OK"){
                if(responsePlayerGoals.data[0])
                    $ctrl.playerGoals= responsePlayerGoals.data[0].total;
                else
                    $ctrl.playerGoals=0;
            }
        }
    );
    ApiService.getPlayerMatchesPlayed($localStorage.currentTeam.team_id,player._id).then(
        function (responsePlayerMatchesPlayed) {
            if(responsePlayerMatchesPlayed.statusText =="OK"){
                if(responsePlayerMatchesPlayed.data[0])
                    $ctrl.playerMatchesPlayed= responsePlayerMatchesPlayed.data[0].total;
                else
                    $ctrl.playerMatchesPlayed=0;
            }
        }
    );
    ApiService.getPlayerMatchesSummoned($localStorage.currentTeam.team_id,player._id).then(
        function (responsePlayerMatchesSummoned){
            if(responsePlayerMatchesSummoned.statusText =="OK"){
                if( responsePlayerMatchesSummoned.data[0])
                     $ctrl.playerMatchesSummoned= responsePlayerMatchesSummoned.data[0].total;
                else
                    $ctrl.playerMatchesSummoned=0;
            }
        }
    );
    $ctrl.ok = function () {
        $uibModalInstance.close(modified);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $ctrl.givePrivileges = function () {
        $ctrl.playerTeam.privileges = true;
        modified = true;
    }

});
