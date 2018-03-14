(function() {
    'use strict';

    angular
        .module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap']);

    angular
        .module('ui.bootstrap.demo')
        .controller('DropdownController', DropdownController);

    function DropdownController() {
        var vm = this;

        vm.isCollapsed = true;
        vm.status = {
            isopen: false
        }
    }

}());