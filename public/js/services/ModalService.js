// public/js/services/ModalService.js
angular.module('ModalService', ['ui.bootstrap','ngAnimate','ngTouch']).factory('ModalService', [function($log,$uibModal) {

    return {
        open : function (animationsEnabled,templateUrl,controller,resolve) {
            var modalInstance = $uibModal.open({
                animation: animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: templateUrl,
                controller: controller,
                controllerAs: '$ctrl',
                resolve: resolve
            });

            modalInstance.result.then(function (msg) {
                console.log(msg);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    }

}]);