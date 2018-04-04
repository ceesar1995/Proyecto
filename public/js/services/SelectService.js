// public/js/services/SelectService.js
angular.module('SelectService', []).factory('SelectService', [function() {
    provinces=[
        { id: 0, name: 'Álava'},
        { id: 1, name: 'Albacete'},
        { id: 2, name: 'Alicante'},
        { id: 3, name: 'Almería'},
        { id: 4, name: 'Asturias'},
        { id: 5, name: 'Avila'},
        { id: 6, name: 'Badajoz'},
        { id: 7, name: 'Barcelona'},
        { id: 8, name: 'Burgos'},
        { id: 9, name: 'Cáceres'},
        { id: 10, name: 'Cádiz'},
        { id: 11, name: 'Cantabria'},
        { id: 12, name: 'Castellón'},
        { id: 13, name: 'Ciudad Real'},
        { id: 14, name: 'Córdoba'},
        { id: 15, name: 'Cuenca'},
        { id: 16, name: 'Gerona'},
        { id: 17, name: 'Granada'},
        { id: 18, name: 'Guadalajara'},
        { id: 19, name: 'Guipúzcua'},
        { id: 20, name: 'Huelva'},
        { id: 21, name: 'Huesca'},
        { id: 22, name: 'Islas Baleares'},
        { id: 23, name: 'Jaén'},
        { id: 24, name: 'La Coruña'},
        { id: 25, name: 'La Rioja'},
        { id: 26, name: 'Las Palmas'},
        { id: 27, name: 'León'},
        { id: 28, name: 'Lérida'},
        { id: 29, name: 'Lugo'},
        { id: 30, name: 'Madrid'},
        { id: 31, name: 'Málaga'},
        { id: 32, name: 'Murcia'},
        { id: 33, name: 'Navarra'},
        { id: 34, name: 'Orense'},
        { id: 35, name: 'Palencia'},
        { id: 36, name: 'Pontevedra'},
        { id: 37, name: 'Salamanca'},
        { id: 38, name: 'Segovia'},
        { id: 39, name: 'Sevilla'},
        { id: 40, name: 'Soria'},
        { id: 41, name: 'Tarrragona'},
        { id: 42, name: 'Tenerife'},
        { id: 43, name: 'Teruel'},
        { id: 44, name: 'Toledo'},
        { id: 45, name: 'Valencia'},
        { id: 46, name: 'Valladolid'},
        { id: 47, name: 'Vizcaya'},
        { id: 48, name: 'Zamora'},
        { id: 49, name: 'Zaragoza'},


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
        },
        getNameById : function (id) {
            return provinces[id].name;
        }
    }

}]);