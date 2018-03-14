// public/js/services/SelectService.js
angular.module('SelectService', []).factory('SelectService', [function() {
    provinces=[
        { id: 0, name: 'Segovia'},
        { id: 1, name: 'Salamanca'},
        { id: 2, name: 'Burgos'},
        { id: 3, name: 'Soria'},
        { id: 4, name: 'Avila'},
        { id: 5, name: 'Zamora'},
        { id: 6, name: 'Palencia'},
        { id: 7, name: 'Valladolid'},
        { id: 8, name: 'León'},
    ];
    return {
        getProvinces : function () {
            return provinces;
        },
        getNamesByIds : function (id) {
            var provincesString = "";
            for(var i=0;i<id.length;i++){
                provincesString = provincesString + provinces[id[i]].name + " ";
            }
            return provincesString;
        }
    }

}]);