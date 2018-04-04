// public/js/services/PlayerService.js
angular.module('ApiService', []).factory('ApiService', ['$http','$q', function($http,$q) {

    return {
        getPlayer : function() {
            return $http.get('/api/player');
        },
        getPlayer : function(id) {
            return $http.get('/api/player/'+id);
        },

        createPlayer : function(playerData) {
            return $http.post('/api/player', playerData);
        },

        updatePlayer : function(id,playerData) {
            return $http.put('/api/player/' + id,playerData);
        },
        getTeam : function() {
            return $http.get('/api/team');
        },
        getTeam : function(id) {
            return $http.get('/api/team/'+id);
        },

        createTeam : function(teamData) {
            return $http.post('/api/team', teamData);
        },

        updateTeam : function(id,teamData) {
            return $http.put('/api/team/' + id,teamData);
        },
        getUser : function() {
            return $http.get('/api/user');
        },
        getUser : function(id) {
            return $http.get('/api/user/'+id);
        },

        createUser : function(userData) {
            return $http.post('/api/user', userData);
        },

        updateUser : function(id,userData) {
            return $http.put('/api/user/' + id,userData);
        },
        checkUser : function (userData) {
            return $http.post('/api/checkUser',userData);
        },
        registerUser : function (userData) {
            return $http.post('/register',userData);
        },
        logInUser : function (userData) {
            return $http.post('/logIn',userData);
        },
        addPlayerToTeam : function (playerTeamData) {
            return $http.post('/api/playerTeam',playerTeamData);
        },
        getPlayerByUserId : function (id) {
            return $http.get('/api/playersByUserId/'+id);
           /* var defered = $q.defer();
            var promise = defered.promise;
            $http.get('/api/playersByUserId/'+id).then(function (data) {
                defered.resolve(data);
            });
            return promise;
            */
        },
        getTeamsByPlayerId : function (id) {
            return $http.get('/api/teamsByPlayerId/'+id);
        },
        sendMessageForum : function (message) {
            return $http.post('/api/messageForum/',message);
        },
        createMessage : function(message) {
            return $http.post('/api/message', message);
        },
        getMessagesForum : function (id) {
            return $http.get('/api/messagesForum/'+id);
        },
        getPlayersTeam : function (id) {
            return $http.get('/api/playersByTeamId/'+id);
        },
        findTeams: function (teamData) {
            return $http.post('/api/findTeams',teamData);
        },
        getUserById : function (id) {
            return $http.get('/api/user/'+id);
        },
        getPlayerById : function (id) {
            return $http.get('/api/player/'+id);
        },
        findPlayersByName: function (name) {
            return $http.get('/api/playersByName/'+name);
        },
        getMatch : function() {
            return $http.get('/api/match');
        },

        createMatch : function(matchData) {
            return $http.post('/api/match', matchData);
        },

        updateMatch : function(id,matchData) {
            return $http.put('/api/match/' + id,matchData);
        },
        createMatchTeam : function(matchTeamData) {
            return $http.post('/api/matchTeam', matchTeamData);
        },
        getInvitationMatchesSent : function (id) {
            return $http.get('/api/matchesSent/'+id);
        },
        getInvitationMatchesReceived : function (id) {
            return $http.get('/api/matchesReceived/'+id);
        },
        updateMatchTeam : function(id,matchData) {
            return $http.put('/api/matchTeam/' + id,matchData);
        },
        getPrivilegesPlayerId : function (idPlayer,idTeam) {
            return $http.get('/api/privileges/'+idPlayer+'/'+idTeam);
        },
        getNextMatches : function (idTeam) {
            return $http.get('/api/nextMatches/'+idTeam);
        },
        getPreviousMatches : function (idTeam) {
            return $http.get('/api/previousMatches/'+idTeam);
        },
        getPlayersSummoned : function (idMatch) {
            return $http.get('/api/playersSummoned/'+idMatch);
        },
        createMatchPlayer : function(matchPlayerData) {
            return $http.post('/api/matchPlayer', matchPlayerData);
        },
        updateMatchPlayer : function(idMatch,idPlayer,matchData) {
            return $http.put('/api/matchPlayer/' + idMatch+ '/'+idPlayer,matchData);
        },
        updatePlayerTeam : function(idTeam,idPlayer,playerTeamData) {
            return $http.put('/api/playerTeam/' + idTeam+ '/'+idPlayer,playerTeamData);
        },
        getMessagesReceived : function (idPlayer) {
            return $http.get('/api/messagesPlayerReceived/'+idPlayer);
        },
        getMessagesSent : function (idPlayer) {
            return $http.get('/api/messagesPlayerSent/'+idPlayer);
        },
        sendMessagePlayer : function (messagePlayerData) {
            return $http.post('/api/messagePlayer',messagePlayerData);
        },
        sendMessageTeam : function (messageTeamData) {
            return $http.post('/api/messageTeam',messageTeamData);
        },
        getMessagesTeamReceived : function (idTeam) {
            return $http.get('/api/messagesTeamReceived/'+idTeam);
        },
        getMessagesTeamSent : function (idTeam) {
            return $http.get('/api/messagesTeamSent/'+idTeam);
        },
        getMessagesAnnouncement : function (idTeam) {
            return $http.get('/api/messagesAnnouncement/'+idTeam);
        },
        sendMessageAnnouncement : function (messageAnouncementData) {
            return $http.post('/api/messageAnnouncement',messageAnouncementData);
        },
        updateMessage : function(idMessage,playerTeamData) {
            return $http.put('/api/message/' + idMessage,playerTeamData);
        },
        updateMessageForum : function(idMessage,playerTeamData) {
            return $http.put('/api/messageForum/' + idMessage,playerTeamData);
        },
        updateMessagePlayer : function(idMessage,playerTeamData) {
            return $http.put('/api/messagePlayer/' + idMessage,playerTeamData);
        },
        updateMessageTeam : function(idMessage,playerTeamData) {
            return $http.put('/api/messageTeam/' + idMessage,playerTeamData);
        }
        ,
        updateMessageAnnouncement : function(idMessage,idTeam,playerTeamData) {
            return $http.put('/api/messageAnnouncement/' + idMessage+'/'+idTeam,playerTeamData);
        },
        getPlayerTeam :function(idTeam,idPlayer) {
            return $http.get('/api/playerTeam/' + idTeam+ '/'+idPlayer);
        },
        findMatches :  function (matchData) {
            return $http.post('/api/findMatch',matchData);
        },









    }

}]);