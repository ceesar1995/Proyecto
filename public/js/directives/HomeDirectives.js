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