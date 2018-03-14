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