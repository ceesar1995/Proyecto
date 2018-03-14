// public/js/directives/LogInDirectives.js
var myDirective = angular.module('logInDirectives',[]);

myDirective.directive("player", function(){
    return {
        scope: {
            name: '@',
            province: '@',
            _id:'@',
            click:'&'
        },
        restrict: "E",
        template: "<div class='list-group'> <a href='/selectTeam' ng-click='click({_id:_id})' class='list-group-item'>   <h4 class='list-group-item-heading'>{{name}}</h4>  </a>  </div>"
    }
});
myDirective.directive("team", function(){
    return {
        scope: {
            name: '@',
            province: '@',
            id:'@',
            click:'&'
        },
        restrict: "E",
        template: "<div class='list-group' ng-click='click({id:id})'> <a  class='list-group-item'>   <h4 class='list-group-item-heading'>{{name}}</h4>  </a>  </div>"
    }
});