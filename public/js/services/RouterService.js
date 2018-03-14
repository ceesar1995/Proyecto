// public/js/services/RouterService.js
angular.module('RouterService', []).factory('RouterService', [function() {
    var savedData = {};
    return {
        openPage : function (url) {
            return window.location.href = url;
        },
        setSavedData : function (data){
            savedData = data;
        },
        getSavedData : function () {
            return savedData;
        }


    }

}]);