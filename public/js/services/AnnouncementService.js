// public/js/services/AnnouncementService.js
angular.module('AnnouncementService', []).factory('AnnouncementService', ['ApiService',function(ApiService) {
    return {
        createAnnouncement : function (announcement,match,idTeam,nameTeam) {

            var message = {};
            message.date = new Date();
            var d = new Date(match.dateBegin);
            message.subject = announcement + nameTeam;
            message.text = "El partido se realizaría en la siguiente fecha: " + d.getUTCDay() +"/" + d.getUTCMonth() + " - " + d.getUTCHours() + ":" + d.getUTCMinutes() + " ,en el siguiente lugar: "+match.place+".";
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
        createAnnouncementsConfirmed :function (match,idTeam,teamName) {
            var message = {};
            message.date = new Date();
            var d = new Date(match.dateBegin);
            message.subject = "Partido confirmado entre " + match.name + " - " + teamName;
            message.text = "El partido se realizara en la siguiente fecha: " + d.getUTCDay() +"/" + d.getUTCMonth() + " - " + d.getUTCHours() + ":" + d.getUTCMinutes() + " ,en el siguiente lugar: "+match.place+".";
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


    }

}]);