import './styles/loading.scss';

const _name = "fxLoading";

interface IDirectiveScope extends ng.IScope {

}

function Directive(): ng.IDirective {
    return {
        restrict: 'EA',
        template: require("./tpls/loading.jade")(),
        scope: {},
        replace: false,
        link: ($scope: IDirectiveScope) => {

        }
    }
}

Directive.$inject = [];

const module = angular.module(`${_name}Module`, []).directive(_name, Directive);

export default `${module.name}`;