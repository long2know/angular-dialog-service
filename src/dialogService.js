(function () {
    var long2know;
    try {
        long2know = angular.module("long2know")
    } catch (err) {
        long2know = null;
    }

    if (!long2know) {
        angular.module('long2know.services', ['ngResource', 'ngAnimate']);
        angular.module('long2know.controllers', []);
        angular.module('long2know.directives', []);
        angular.module('long2know',
            [
                'long2know.services',
                'long2know.controllers',
                'long2know.directives'
            ]);
    };

var dialogService = function ($modal, $sce, $q) {
        var
            // Generic wrapper around modal opening
            openDialog = function (template, controller) {
                var modal = $modal.open({
                    templateUrl: template,
                    controller: controller
                });
                return modal;
            },

            // Another generic wrapper for dialog service that will load an external template and pass in a resolved model
            // The specified controller is expected to do something with dialogModel.
            openDialogWithModel = function (templateUrl, controller, model, windowClass, isInlineHtml, size) {
                if (!size) {
                    size = 'sm';
                }

                var modal = null;

                if (isInlineHtml) {
                    modal = $modal.open({
                        controller: controller,
                        template: templateUrl,
                        resolve: {
                            dialogModel: function () { return model; }
                        },
                        windowClass: windowClass,
                        size: size
                    });
                } else {
                    modal = $modal.open({
                        controller: controller,
                        templateUrl: templateUrl,
                        resolve: {
                            dialogModel: function () { return model; }
                        },
                        windowClass: windowClass,
                        size: size
                    });
                }

                return modal;
            },

            openErrorDialog = function () {
                var modal = openDialog("modalError.html", ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    var errorTitle = 'Error!';
                    var errorBody = 'Please correct the errors listed!';
                    $scope.modalHeader = $sce.trustAsHtml(errorTitle);
                    $scope.modalBody = $sce.trustAsHtml(stringFormat("<p><strong>{0}</strong></p>", errorBody));
                    $scope.ok = function () {
                        $uibModalInstance.close();
                    };
                    $scope.hasCancel = false;
                }]);

                return modal;
            },

            openDiscardChangesDialog = function () {
                var defer = $q.defer();
                var modalTitle = "Discard your changes?";
                var modalBody = stringFormat('Are you sure you want to discard your changes?');
                var modal = openDialog("modalGeneral.html", ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.modalHeader = $sce.trustAsHtml(modalTitle);
                    $scope.modalBody = $sce.trustAsHtml(stringFormat("<p><strong>{0}</strong></p>", modalBody));
                    $scope.ok = function () {
                        $scope.$close();
                        defer.resolve();
                    };
                    $scope.hasCancel = true;
                    $scope.cancel = function () {
                        $scope.$close();
                        defer.reject();
                    };
                }]);
                return defer.promise;
            },

            stringFormat = function () {
                var s = arguments[0];
                for (var i = 0; i < arguments.length - 1; i++) {
                    s = s.replace("{" + i + "}", arguments[i + 1]);
                }
                return s;
            };

        return {
            openDialog: openDialog,
            openErrorDialog: openErrorDialog,
            openDialogWithModel: openDialogWithModel,
            openDiscardChangesDialog: openDiscardChangesDialog,
            stringFormat: stringFormat
        };
    };

    dialogService.$inject = ['$uibModal', '$sce', '$q'];
    angular.module('long2know.services')
        .factory('dialogService', dialogService);
})()
