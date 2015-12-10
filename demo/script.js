(function () {
    angular.module('myApp.services', ['ngResource', 'ngAnimate']);
    angular.module('myApp.controllers', []);

    var myApp = angular.module('myApp', [
        'myApp.services',
        'myApp.controllers',
        'long2know',
        'ngSanitize',
        'ui.bootstrap',
        'ui']);    

    var myController = function ($log, ds) {
        var vm = this;
        vm.modalFormModel = {
            firstname: 'original',
            lastname: 'original'
        };

        vm.openSimpleModal = function () {
            ds.openDialog("modalSimple.html", ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.ok = function () {
                    $uibModalInstance.close();
                    $log.log("User clicked ok.");
                },
                $scope.cancel = function () {
                    $uibModalInstance.close();
                    $log.log("User clicked cancel.");
                };
            }]);
        }

        vm.openFormModal = function () {
            ds.openDialogWithModel('modalForm.html', 'modalFormCtrl as mf', vm.modalFormModel, '', false, 'lg');
        }
    };

    var modalFormController = function ($log, $uibModalInstance, dialogModel) {
        var vm = this;
        // Clone so we can cancel our edit
        vm.dialogModel = angular.copy(dialogModel);
        vm.ok = function () {
            for (var p in vm.dialogModel) {
                if (dialogModel.hasOwnProperty(p)) {
                    dialogModel[p] = vm.dialogModel[p];
                }
            }
            $uibModalInstance.close();
            $log.log("User clicked submit - saving changes");
        },
        vm.cancel = function () {
            $uibModalInstance.close();
            $log.log("User clicked cancel.");
        };
    };

    modalFormController.$inject = ['$log', '$uibModalInstance', 'dialogModel'];
    angular.module('myApp.controllers')
        .controller('modalFormCtrl', modalFormController);

    myController.$inject = ['$log', 'dialogService'];
    angular.module('myApp.controllers')
        .controller('myCtrl', myController);

    myApp.config(['$uibModalProvider', '$locationProvider',
        function ($uibModalProvider, $locationProvider) {
            $uibModalProvider.options = { animation: true, backdrop: 'static', keyboard: false };
            $locationProvider.html5Mode(false);
        }]);

    myApp.run(['$log', function ($log) { $log.log("Start."); }]);
})()
