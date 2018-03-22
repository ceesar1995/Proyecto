// public/js/directives/HomeDirectives.js
var myDirective = angular.module('homeDirectives',[]);

myDirective.directive("forumCard", function(){
    return {
        scope: {
            subject: '@',
            text:'@',
            date: '@',
            player : '@'
        },
        restrict: "E",
        templateUrl: 'js/directives/templates/forumCard.html'
    }
});
myDirective.directive("playerCard", function(){
    return {
        scope: {
            name: '@',
            goalkeeper:'@',
            coordinator: '@',
            date : '@',
            provinces: '@'
        },
        restrict: "E",
        templateUrl: 'js/directives/templates/playerCard.html'
    }
});
myDirective.directive("teamSearchCard", function(){
    return {
        scope: {
            name: '@',
            provinces: '@',
            _id:'@',
            click:'&'
        },
        restrict: "E",
        templateUrl: 'js/directives/templates/teamSearchCard.html'
    }
});
myDirective.directive("playerSearchCard", function(){
    return {
        scope: {
            name: '@',
            teamNames:'@',
            provinces: '@',
            _id:'@',
            click:'&'
        },
        restrict: "E",
        templateUrl: 'js/directives/templates/playerSearchCard.html'
    }
});
myDirective.directive("teamInviteCard", function(){
    return {
        scope: {
            name: '@',
            provinces: '@',
            _id:'@',
            click:'&'
        },
        restrict: "E",
        templateUrl: 'js/directives/templates/teamInviteCard.html'
    }
});
myDirective.directive("invitationSentMatchCard", function(){
    return {
        scope: {
            name: '@',
            dateBegin: '@',
            dateEnd: '@',
            place: '@',
            rules: '@',
            dateCreated: '@',
            _id:'@',
            click:'&',
            rejected: '@',
            showBt: '&'

        },
        restrict: "E",
        templateUrl: 'js/directives/templates/invitationSentMatchCard.html'
    }
});
myDirective.directive("invitationReceivedMatchCard", function(){
    return {
        scope: {
            name: '@',
            dateBegin: '@',
            dateEnd: '@',
            place: '@',
            rules: '@',
            dateCreated: '@',
            _id:'@',
            rejected: '@',
            clickC:'&',
            clickR:'&',
            confirmed: '@',
            showBt: '&'
        },
        restrict: "E",
        templateUrl: 'js/directives/templates/invitationReceivedMatchCard.html'
    }
});
myDirective.directive("nextMatchCard", function(){
    return {
        scope: {
            name: '@',
            dateBegin: '@',
            dateEnd: '@',
            place: '@',
            rules: '@',
            dateCreated: '@',
            _id:'@',
            summonBt :'&'
        },
        restrict: "E",
        templateUrl: 'js/directives/templates/nextMatchCard.html'
    }
});
myDirective.directive("previousMatchCard", function(){
    return {
        scope: {
            teamHome: '@',
            teamGuest: '@',
            dateBegin: '@',
            dateEnd: '@',
            place: '@',
            rules: '@',
            scoreHome: '@',
            scoreGuest: '@',
            dateCreated: '@',
            _id:'@',
            afterMatchReportBt :'&',
            showBt :'&'

        },
        restrict: "E",
        templateUrl: 'js/directives/templates/previousMatchCard.html'
    }
});
myDirective.directive("playerSummonCard", function(){
    return {
        scope: {
            name: '@',
            goalkeeper:'@',
            date:'@'
        },
        restrict: "E",
        templateUrl: 'js/directives/templates/playerSummonCard.html'
    }
});
myDirective.directive("playerReportCard", function(){
    return {
        scope: {
            name: '@',
            goalkeeper:'@',
            played: '=',
            goals: '=',
            save: '&'
        },
        restrict: "E",
        templateUrl: 'js/directives/templates/playerReportCard.html',

    }
});
