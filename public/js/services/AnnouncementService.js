// public/js/services/AnnouncementService.js
angular.module('AnnouncementService', []).factory('AnnouncementService', ['ApiService',function(ApiService,$localStorage) {
    return {
        createAnnouncement : function (announcement,match,idTeam,nameTeam,date) {

            var message = {};
            message.date = new Date();
            message.subject = announcement + nameTeam;
            message.text = "El partido se realizaría en la siguiente fecha: " + date + " ,en el siguiente lugar: "+match.place+".";
            message.idUser = $localStorage.currentUser.user_id;
            ApiService.createMessage(message).then(
                function (responseMessage) {
                    if(responseMessage.statusText=="OK"){
                        var messageAnnouncement = {};
                        messageAnnouncement.idMessage = responseMessage.data._id;
                        messageAnnouncement.idTeam = idTeam;
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
        },
        createAnnouncementsConfirmed :function (match,idTeam,teamName,date) {
            var message = {};
            message.date = new Date();
            message.subject = "Partido confirmado entre " + match.name + " - " + teamName;
            message.text = "El partido se realizara en la siguiente fecha: " + date + " ,en el siguiente lugar: "+match.place+".";
            message.idUser = $localStorage.currentUser.user_id;
            ApiService.createMessage(message).then(
                function (responseMessage) {
                    if (responseMessage.statusText == "OK") {
                        var messageAnnouncement = {};
                        messageAnnouncement.idMessage = responseMessage.data._id;
                        messageAnnouncement.idTeam = idTeam;
                        ApiService.sendMessageAnnouncement(messageAnnouncement).then(
                            function (responseMessageTeam) {
                                if (responseMessageTeam.statusText == "OK") {
                                    console.log(responseMessageTeam.data);
                                }
                            }
                        );
                    }
                });
            ApiService.createMessage(message).then(
                function (responseMessage) {
                    if (responseMessage.statusText == "OK") {
                        var messageAnnouncement = {};
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
        },createAnnouncementCancelled : function (announcement,idTeam,nameTeam,date) {

            var message = {};
            message.date = new Date();
            message.subject = announcement + nameTeam;
            message.text = "El partido ha sido cancelado el " + date  +".";
            message.idUser = $localStorage.currentUser.user_id;
            ApiService.createMessage(message).then(
                function (responseMessage) {
                    if(responseMessage.statusText=="OK"){
                        var messageAnnouncement = {};
                        messageAnnouncement.idMessage = responseMessage.data._id;
                        messageAnnouncement.idTeam = idTeam;
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


    }

}]);