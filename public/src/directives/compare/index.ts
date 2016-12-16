/**
 * Created by NICK on 16/8/26.
 */


import { compare } from './normal';
import * as pointer from 'json-pointer';

class CompileDirective {
    /**
     * 定义指令
     */
    public static directive: ng.Injectable<ng.IDirectiveFactory> = [
        "$compile",
        ($compile) => {
            let directive: ng.IDirective = {
                replace: false,
                require: "ngModel",
                restrict: "A",
                scope: {
                    compareTo: "@",
                    compareType: "@",
                    compareOpt: "@",
                    compareForm: "=",
                    compareModel: "="
                },
                link: ($scope: ng.IScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes, ngModel: ng.INgModelController) => {
                    // ngModel.$validators['compareTo'] = (modelValue, viewValue) => {

                    // }

                    if (!$scope["compareForm"] || !$scope["compareTo"] || !$scope["compareModel"]) {
                        return;
                    }

                    let keys = [].concat($scope["compareForm"].key || []);

                    keys.pop();
                    keys.push($scope["compareTo"]);

                    ngModel.$validators["compareTo"] = ((modelValue) => {
                        if (pointer.has($scope["compareModel"], "/" + keys.join("/"))) {
                            // ngModel.$setValidity("compareTo", );
                            return compare.doCompare(modelValue, pointer.get($scope["compareModel"], "/" + keys.join("/")), $scope["compareType"] || "", $scope["compareOpt"] || "eq");
                        }
                        return true;
                    });

                    $scope.$watch(() => {
                        if (pointer.has($scope["compareModel"], "/" + keys.join("/"))) {
                            return pointer.get($scope["compareModel"], "/" + keys.join("/"));
                        }
                    }, (newValue, oldValue) => {
                        ngModel.$validate();
                    });

                }
            };

            return directive;
        }
    ];
}

const moduleName = "compareTo";

const module = angular.module(`${moduleName}Module`, []).directive(moduleName, CompileDirective.directive);

export default `${module.name}`;