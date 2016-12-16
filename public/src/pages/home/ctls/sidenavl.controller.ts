/**
 * Created by NICK on 16/8/10.
 */

import * as _ from 'lodash';
import Dictionary = _.Dictionary;

export class SidenavLeftController {
    static $inject = ["$rootScope", "mdSideMenuSections", "toolbarUtils", "fxAction", "$state", "$stateParams", "$timeout", "fxSideMenuFactory"];

    toolbarBottom: Object;
    selectedNodes = {};
    modules: Array<any>;
    doLinkBind: Function;

    constructor(private $rootScope, private mdSideMenuSections, private toolbarUtils, private fxAction, private $state: angular.ui.IStateService, private $stateParams: ng.ui.IStateParamsService, private $timeout: ng.ITimeoutService, private fxSideMenuFactory) {
        this.initModules().initToolbar();
        this.doLinkBind = this.doLink.bind(this);
    }

    /**
     * 计算模块的层级关系
     */
    getModules() {
        let promise = this.fxAction.doAction('moduleMenuAction', null);

        promise && promise.then((results) => {
            let nodes: Array<any> = [];

            _.forEach(results, (result) => {
                if (_.isArray(result)) {
                    nodes = nodes.concat(result);
                }
            });

            let nodesGroupByDepth = _.groupBy(_.keyBy(nodes, "key"), "depth");
            let depth = 0, root = {};

            while (true) {
                let nodesIsDepth = nodesGroupByDepth[depth];
                let parentIsDepth = nodesGroupByDepth[depth - 1];

                if (nodesIsDepth && nodesIsDepth.length > 0) {
                    switch (depth) {
                        case 0:
                            root = nodesIsDepth[0];
                            break;
                        case 1:
                            root['nodes'] = nodesIsDepth;
                            break;
                        default:
                            _.forEach(parentIsDepth, (parentNode) => {
                                parentNode["nodes"] = _.filter(nodesIsDepth, (node) => {
                                    return node.lft > parentNode.lft && parentNode.rgt > node.rgt;
                                });
                            });
                            break;
                    }
                } else {
                    break;
                }
                depth++;
            }

            this.mdSideMenuSections.sections = root["nodes"];
            this.modules = this.mdSideMenuSections.sections;
            this.selectedNodes = _.keyBy(nodesGroupByDepth[1], "key") || {};
            this.fxSideMenuFactory.onStateChangeStart(null, this.$state.current, this.$state.params);
        });
    }

    /**
     * 初始化菜单
     * @returns {SidenavLeftController}
     */
    initModules() {
        this.getModules();

        this.mdSideMenuSections.options = {
            children: "nodes",
            key: 'key',
            dirSelectable: false,
            orderBy: 'lft',
            filterField: 'key'
        };

        return this;
    }

    /**
     * 初始化底部按钮
     * @returns {SidenavLeftController}
     */
    initToolbar() {
        this.toolbarBottom = [
            this.toolbarUtils.layoutBuilder("", "row", "space-around center").toolsBuilder([
                this.toolbarUtils.btnBuilder("刷新", "md-icon-button", false, "top").iconBuilder("refresh").btnClick(($event) => {
                    this.getModules();
                }).toValue(),
                this.toolbarUtils.btnBuilder("全部折叠", "md-icon-button", false, "top").iconBuilder("dehaze").btnClick(($event) => {
                    _.forEach(this.selectedNodes, (val, key) => {
                        delete this.selectedNodes[key];
                    })
                }).toValue()
            ]).toValue()
        ];

        return this;
    }

    /**
     * 点击左侧导航栏事件
     * @param $event
     * @param node
     */
    doLink($event, node) {
        if (node && node.link && node.key) {
            this.$timeout(() => {
                this.$state.go(node.link, node);
            }, 200);
        }
    }
}