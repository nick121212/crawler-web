/**
 * Created by NICK on 16/8/16.
 */

import * as _ from 'lodash';
import "./styles/sidemenu.scss";

const _name = "fxSideMenu", _module = `${_name}Module`;

interface IDirectiveScope extends ng.IScope {
    node: Object;
    $sideMenuTransclude: Object;
}

class Controller {
    static $inject = ["$scope", "$compile", "$interpolate", "mdSideMenuSections"];

    template: any;
    selectedNodes: Object;
    doLink: Function;
    options: Object = {};

    constructor(private $scope, private $compile, private $interpolate, private mdSideMenuSections) {
        this.template = $compile($interpolate(require("./tpls/sidemenu.jade")())({
            opts: mdSideMenuSections.options
        }));

        this.options = this.mdSideMenuSections.options;
    }

    doLinkPre($event, node) {
        if (_.isFunction(this.doLink)) {
            this.doLink($event, node);
        }
        console.log(node);
    }

    /**
     * 显示和隐藏子菜单
     * @param node   {Object} 菜单的数据
     */
    showChildren(node) {
        let opts = this.mdSideMenuSections.options;

        if (this.selectedNodes.hasOwnProperty(node[opts.key])) {
            delete this.selectedNodes[node[opts.key]];
        } else {
            if (node[opts.children] && node[opts.children].length) {
                this.selectedNodes[node[opts.key]] = node;
            }
        }
    }

    /**
     * 子节点是否显示
     * @param node {Object} 菜单的数据
     * @returns {boolean}
     */
    isShowChildren(node) {
        let opts = this.mdSideMenuSections.options;

        return !!this.selectedNodes[node[opts.key]];
    }

    /**
     * 判断是否是叶子节点
     * @param node   {Object} 菜单的数据
     * @returns {boolean}
     */
    isLeaf(node) {
        let opts = this.mdSideMenuSections.options;

        return node.rgt - node.lft == 1 || !node[opts.children] || node[opts.children].length == 0;
    }

    /**
     * 是否选中
     * @param node    {Object} 菜单的数据
     * @returns {boolean}
     */
    isSelected(node) {
        let opts = this.mdSideMenuSections.options;

        return !!this.mdSideMenuSections.selectedNode && this.mdSideMenuSections.selectedNode[opts.key] == node[opts.key];
    }

}


/**
 * sidemenu指令
 * @param mdSideMenuSections
 * @returns {{restrict: string, replace: boolean, require: string, transclude: boolean, controllerAs: string, scope: {modules: string}, bindToController: {selectedNodes: string}, controller: Controller, compile: (($ele:ng.IAugmentedJQuery, $attr:ng.IAttributes, childTranscludeFn:any)=>($scope:IDirectiveScope, $element:any, attrs:any, $ctrl:any)=>undefined)}}
 * @constructor
 */
function Directive(mdSideMenuSections): ng.IDirective {
    return {
        restrict: 'EA',
        replace: false,
        require: _name,
        transclude: true,
        controllerAs: "sideCtl",
        scope: {
            modules: '='
        },
        bindToController: {
            selectedNodes: '=',
            doLink: '=?ngClick'
        },
        controller: Controller,
        compile: ($ele: ng.IAugmentedJQuery, $attr: ng.IAttributes, childTranscludeFn) => {
            return ($scope: IDirectiveScope, $element, attrs, $ctrl) => {
                // 监听modules的变化,初始化根节点数据
                $scope.$watch("modules", function updateNodeOnRootScope(newValue) {
                    let opts = mdSideMenuSections.options;

                    if (_.isArray(newValue)) {
                        if (angular.isDefined($scope.node) && angular.equals($scope.node[opts.children], newValue)) {
                            return;
                        }
                        $scope.node = {};
                        $scope.node[opts.children] = newValue;
                    }
                    else {
                        if (angular.equals($scope.node, newValue)) {
                            return;
                        }
                        $scope.node = newValue;
                    }
                });
                // 应用模板
                $ctrl.template($scope, function (clone) {
                    $element.html('').append(clone);
                });
                $scope.$sideMenuTransclude = childTranscludeFn;
            };
        }
    };
}

export const module = angular.module(_module, ["ngAnimate", "ngMaterial"]).directive(_name, ["mdSideMenuSections", Directive]);
export default `${module.name}`;