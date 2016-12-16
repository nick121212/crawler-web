import { module } from './module';

function Directive(): ng.IDirective {
    return {
        link: ($scope, $element, $attrs, $ctrl) => {
            $scope['$sideMenuTransclude']($scope, function (clone) {
                $element.empty();
                $element.append(clone);
            });
        }
    };
}

// export default (module: ng.IModule)=> {
module.directive('fxSideMenuContentTransclude', Directive);
// };