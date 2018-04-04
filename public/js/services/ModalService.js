// public/js/services/ModalService.js
angular.module('ModalService', []).factory('ModalService', [function() {

    return {
        createModal : function (animationsEnabled,templateUrl,controller,size,resolve) {
            var modalInstance = {
                animation: animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: templateUrl,
                controller: controller,
                controllerAs: '$ctrl',
                size: size,
                resolve: resolve
            };

            return modalInstance;
        }
    }

}]);