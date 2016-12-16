import {module} from './module';

function Directive(): ng.IDirective {
    return {
        restrict: 'EA',
        require: '^fxSideMenu',
        link: function ($scope, $element, $attrs, $ctrl) {
            $ctrl['template']($scope, function (clone) {
                $element.html('').append(clone);
            });
        }
    };
}

module.directive('fxSideMenuChild', Directive);