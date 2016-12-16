import { module } from './module';

const _name = "mdStyleColor";

function Directive(mdSideMenuSections): ng.IDirective {
    return {
        restrict: 'A',
        scope: {
            mdStyleColor: '='
        },
        link: ($scope, $element, $attrs) => {
            let themeColors, split, hueR, colorR, colorA, hueA, colorValue,
                _apply_color = () => {
                    for (let p in $scope[_name]) {
                        if ($scope[_name].hasOwnProperty(p)) {
                            themeColors = mdSideMenuSections.theme.colors,
                                split = ($scope[_name][p] || '').split('.');

                            if (split.length < 2) {
                                split.unshift('primary');
                            }
                            hueR = split[1] || 'hue-1';
                            colorR = split[0] || 'primary'; // 'warn'

                            // Absolute color: 'orange'
                            colorA = themeColors[colorR] ? themeColors[colorR].name : colorR;
                            // Absolute Hue: '500'
                            hueA = themeColors[colorR] ? (themeColors[colorR].hues[hueR] || hueR) : hueR;
                            colorValue = mdSideMenuSections.palettes[colorA][hueA] ? mdSideMenuSections.palettes[colorA][hueA].value : mdSideMenuSections.palettes[colorA]['500'].value;

                            if (hueA !== '0') {
                                $element.css(p, 'rgb(' + colorValue.join(',') + ')');
                            } else {
                                $element.css(p, 'transparent');
                            }
                        }
                    }
                };

            if (!mdSideMenuSections.theme || !mdSideMenuSections.palettes) {
                return console.warn('you probably want to ssSideNavSectionsProvider.initWithTheme($mdThemingProvider)');
            }

            $scope.$watch(_name, function (oldVal, newVal) {
                if ((oldVal && newVal) && oldVal !== newVal) {
                    _apply_color();
                }
            }, true);
            _apply_color();
        }
    }
}

module.directive(_name, ["mdSideMenuSections", Directive]);