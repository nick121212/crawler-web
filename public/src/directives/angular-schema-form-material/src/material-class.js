angular.module('schemaForm').directive('sfMaterialClass', ["$compile", "$timeout", function ($compile, $timeout) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs, ngModel) {
            function reduceHelper(obj, i) {
                return obj[i]
            }

            var modelValue;

            try {
                if (scope.item) {
                    modelValue = scope.form.key.slice(scope.form.key.length - 1).reduce(reduceHelper, scope.item || scope.model);
                } else {
                    modelValue = scope.form.key.reduce(reduceHelper, scope.model);

                    if (!modelValue) {
                        modelValue = scope.form.schema.default;
                    }
                }
            } catch (e) {
                modelValue = undefined;
            }

            // Element class is not set in DOM if executed immediately.
            // I don't understand exactly why but it's probably related to other directive job.
            $timeout(function () {
                if (modelValue !== null && typeof modelValue !== 'undefined' && modelValue !== false) {
                    element.addClass(attrs.sfMaterialClass);
                }
            }, 0);
        }
    };
}]);