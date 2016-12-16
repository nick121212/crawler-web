import { module } from './module';

interface IDirectiveScope extends ng.IScope {
    searchText: string;
    title: string;
    timeID: any;
}

function Directive(mdSideMenuSections, $timeout): ng.IDirective {
    return {
        restrict: 'EA',
        template: require("./tpls/search.jade"),
        controllerAs: "searchCtl",
        link: function ($scope: IDirectiveScope) {
            $scope.searchText = "";
            $scope.title = "搜索菜单";

            $scope.$watch("searchText", (newVal, oldVal) => {
                $timeout.cancel($scope.timeID);
                $scope.timeID = $timeout(() => {
                    mdSideMenuSections.options.filterExpression = newVal;
                }, 1000);
            });
        }
    };
}

// export default (module: ng.IModule)=> {
module.directive('fxSideMenuSearch', ["mdSideMenuSections", "$timeout", Directive]);
// };