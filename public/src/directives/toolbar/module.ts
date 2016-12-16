import * as _ from 'lodash';

const _name = "fxToolbar";

interface IDirectiveScope extends ng.IScope {
    ngModel: Object;
}

class Strategy {
    private tools: { [id: string]: string; } = {};

    register(key: string, template: string) {
        this.tools[key] = template;
    }

    get(key: string) {
        return this.tools[key] || "";
    }
}

const strategy = new Strategy();

strategy.register("icon", require('./tpls/icon.jade')());
strategy.register("btn", require('./tpls/btn.jade')());
strategy.register("layout", require('./tpls/layout.jade')());
strategy.register("label", require('./tpls/label.jade')());
strategy.register("menu", require('./tpls/menu.jade')());
strategy.register("menuItem", require('./tpls/menu-item.jade')());

class Controller {
    static $inject = ["$scope", "$rootScope", "$compile", "$interpolate", "materialUtils"];

    ctls: string;
    items: Object;
    ngModel: Object;
    ngDisabled: Object;
    index: number;

    constructor(private $scope: ng.IScope, private $rootScope: ng.IRootScopeService, private $compile: ng.ICompileService, private $interpolate: ng.IInterpolateService, private materialUtils: fx.utils.materialStatic) {

    }

    openMenu($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    }

    dig(models, $ele, $scope) {
        _.each(models, (model) => {
            let template = strategy.get(model['type']);
            let $newScope = $scope.$new(true, $scope);
            let tmp: string, $newEle: JQuery;

            if (!template) {
                template = model.template;
            }
            if (!template) {
                return console.error("没有模板或者找不到类型!");
            }

            model = _.cloneDeep(model);

            model.disabled = `${this.ngDisabled}`;
            model.materialUtils = this.materialUtils;
            model.ngModel = this.ngModel;
            model.index = this.index;
            if (model.conditionInfo && model.conditionInfo.condition) {
                if (model.conditionInfo.prefix) {
                    model.condition = `${model['type']}Ctl.${model.conditionInfo.condition}`;
                } else {
                    model.condition = `${model.conditionInfo.condition}`;
                }
            } else {
                model.condition = "true";
            }
            // 设置controllerAs
            $newScope[`${model['type']}Ctl`] = _.clone(model);
            if (this.ctls) {
                $newScope[this.ctls] = $scope.$parent[this.ctls] || {};
            }

            this.$scope.$watch(() => {
                return this.index;
            }, (newValue, oldValue) => {
                if (newValue != oldValue) {
                    $newScope[`${model['type']}Ctl`]["index"] = newValue;
                }
            });

            // 编译一次模板
            tmp = this.$interpolate(template)($newScope);
            $newEle = angular.element(tmp);
            // 设置属性
            _.each(model.attributes, (attr, key) => {
                $newEle.attr(key, attr);
            });
            // $compile
            $newEle = this.$compile($newEle)($newScope);
            $ele.append($newEle);
            // 递归
            if (_.isArray(model.tools)) {
                this.dig(model.tools, $newEle, $newScope);
            }
        });
    }
}

function Directive(): ng.IDirective {
    return {
        restrict: 'EA',
        require: [_name],
        scope: {},
        bindToController: {
            ctls: '@',
            ngDisabled: '@',
            items: "=",
            ngModel: '=',
            index: '=?'
        },
        controllerAs: 'toolbarCtl',
        controller: Controller,
        replace: false,
        link: ($scope: IDirectiveScope, $ele: ng.IAugmentedJQuery, $attr: ng.IAttributes, $ctl: Controller) => {
            $scope.$watchCollection(() => {
                return $ctl[0].items;
            }, (newValue) => {
                let model = newValue;

                if (!model) return;
                if (!_.isObject(model) && !_.isArray(model)) {
                    return console.error("items只能是对象或者数组!");
                }
                $ctl[0].dig(_.isArray(model) ? model : [model], $ele, $scope);
            });
        }
    }
}

Directive.$inject = [];

export const module = angular.module(`${_name}Module`, []).directive(_name, Directive);
export default `${module.name}`;

