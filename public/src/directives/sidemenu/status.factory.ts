import { module } from './module';
import * as _ from 'lodash';

function Factory($rootScope, $timeout, mdSideMenuSections): any {
    let onStateChangeStart = function (event, toState, toParams) {
        let options = mdSideMenuSections.options;

        function digest(sections, currentSection) {
            !mdSideMenuSections.selectedNode && sections &&

                _.forEach(sections, (section) => {
                    if (section[mdSideMenuSections.options.children] && section[mdSideMenuSections.options.children].length) {
                        digest(section[mdSideMenuSections.options.children], section);
                    }
                    if (section.showed && toState.name == section.link && toParams.key == section.key) {
                        mdSideMenuSections.selectedNode = section;
                        return false;
                    }
                });

            return false;
        }

        mdSideMenuSections.selectedNode = null;
        $timeout(() => {
            digest(mdSideMenuSections.sections, null);
        }, 10);
    };
    $rootScope.$on('$stateChangeSuccess', onStateChangeStart);

    return {
        onStateChangeStart: onStateChangeStart
    };
}

module.factory('fxSideMenuFactory', ["$rootScope", "$timeout", "mdSideMenuSections", Factory]);