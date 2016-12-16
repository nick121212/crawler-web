import { module } from '../module';
import { IActionModel, IClientData, IQueryData, ActionType } from '../models/action.model';
import * as pointer from 'json-pointer';
import * as _ from 'lodash';

class Controller {
    static $inject = ["$rootScope", "$scope", "$q", "$timeout", "fxAction", "toolbarUtils", "materialUtils"];

    key: string;
    mdLimitOptions: Array<number> = [1, 10, 30, 50, 100, 300];
    actionModel: IActionModel;
    clientData: IClientData;
    queryData: IQueryData;
    isBusy: boolean = false;
    showPage: boolean = true;
    selected: Array<Object>;
    promise: ng.IPromise<any>;
    showToolbar: boolean;
    _filter: any;
    multiple: boolean;
    local: boolean;
    autoSelect: boolean;
    itemToolbars: Array<any>;
    topToolbars: Array<any>;

    onOrderChange: Function;
    onPageChange: Function;
    doSearchBind: Function;

    /**
     * 构造函数
     * @param $scope
     * @param $q
     * @param $timeout
     * @param fxAction
     * @param toolbarUtils
     * @param materialUtils
     */
    constructor(private $rootScope: angular.IRootScopeService, private $scope: angular.IScope, private $q, private $timeout, private fxAction, private toolbarUtils, private materialUtils: fx.utils.materialStatic) {
        !this.clientData && (this.clientData = {});
        !this.selected && (this.selected = []);

        fxAction.getModel(this.key).then((model) => {
            this.actionModel = _.cloneDeep(model);
            this.queryData = _.extend({ offset: 0, limit: 10, page: 1 }, this.actionModel.list.queryData || {}, this.queryData || {});
            if (!this.local) {
                this.initToolbar();
                this.initItemToolbar();
                this.doSearch();
                this.initEvents();
            } else {
                this.actionModel.list.itemToolbars = this.itemToolbars || [];
                this.actionModel.list.toolbars = this.topToolbars || [];
            }
        });
        this.onOrderChange = this.orderChange.bind(this);
        this.onPageChange = this.pageChange.bind(this);
        this.doSearchBind = this.doSearch.bind(this);
        // 销毁事件
        this.$scope.$on("$destroy", () => {
            this.actionModel = null;
            this.queryData = null;
            this.onOrderChange = null;
            this.onPageChange = null;
            this.doSearchBind = null;
            this.selected = null;
            this.itemToolbars = null;
            this.topToolbars = null;
        });

        this.$scope.$watch(() => {
            return this._filter;
        }, (newValue, oldValue) => {
            if (newValue && newValue != oldValue) {
                this.doSearch();
            }
        });
    }

    initEvents() {
        let timeId;
        this.$rootScope.$on(`${this.key}:refresh`, () => {
            if(timeId) this.$timeout.cancel(timeId);
            timeId = this.$timeout(() => {
                this.doSearch(this.queryData.where || {});
            }, 500);
        });
    }

    orderFunc(): string | Array<string> {
        if (this.queryData && this.queryData.order) {
            return this.queryData.order.replace(/\-/ig, '');
        }

        return [];
    }

    /**
     * 按钮的点击事件
     * @param $event
     * @param actionModel
     * @param item
     */
    doClickActionMenu($event, actionModel: IActionModel, item) {
        let itemSource = _.clone(item);

        actionModel.cancel = false;
        this.$rootScope.$broadcast(`${this.key}:clickItem`, actionModel, item);
        if (actionModel.cancel) {
            return;
        }
        // 取得数据中的特定部分
        if (actionModel.type === ActionType.form || actionModel.type === ActionType.wizard) {
            itemSource = {};
            if (pointer.has(item, actionModel.path || "")) {
                itemSource = pointer.get(item, actionModel.path || "");
            }
        }
        // 执行相应的操作
        let promise = this.fxAction.doActionModel($event, actionModel, itemSource);

        promise && promise.then((result) => {
            this.materialUtils.showMsg(`${actionModel.successMsg || "操作成功!"}`);
            this.$timeout(() => {
                if (actionModel.refreshList) {
                    this.doSearch(this.queryData.where || {});
                }
            }, 200);
        });
    }

    /**
     * 初始化顶部toolbar
     */
    initToolbar() {
        this.actionModel.list.toolbars = [];
        // 获取操作按钮
        this.fxAction.getModels(this.actionModel.actions).then((actionModels) => {
            // 添加标题label和icon
            this.actionModel.list.toolbars.push(this.toolbarUtils.noneBuilder("icon").iconBuilder(this.actionModel.icon, {}).toValue());
            this.actionModel.list.toolbars.push(this.toolbarUtils.labelBuilder(`${this.actionModel.title}`).attrBuilder({ flex: "" }).toValue());
            // 添加顶部按钮
            _.forEach(actionModels, (actionModel: IActionModel) => {
                if (actionModel.type !== ActionType.list) {
                    this.actionModel.list.toolbars.push(this.toolbarUtils.btnBuilder(actionModel.title, "md-icon-button", false).tooltipBuilder("").iconBuilder(actionModel.icon, {}).btnClick(($event, item: any) => {
                        this.doClickActionMenu($event, actionModel, item || {});
                    }).toValue());
                }
            });
            // 添加刷新按钮
            if (this.actionModel.list.showRefreshBtn) {
                this.actionModel.list.toolbars.push(this.toolbarUtils.btnBuilder("刷新", "md-icon-button", false).iconBuilder("refresh", {}).btnClick(($event) => {
                    this.doSearch(this.queryData.where || {});
                }).toValue());
            }
            // 添加显示/隐藏搜索按钮
            if (this.actionModel.list.showSearchBtn) {
                this.actionModel.list.toolbars.push(this.toolbarUtils.btnBuilder("{{listCtl.actionModel.list.showSearchPanel?'关闭搜索栏':'打开搜索栏'}}", "md-icon-button", false).iconBuilder("{{listCtl.actionModel.list.showSearchPanel?'window-open':'window-closed'}}", {}).btnClick(($event) => {
                    this.actionModel.list.showSearchPanel = !this.actionModel.list.showSearchPanel;
                }).toValue());
            }
            this.$rootScope.$broadcast(`${this.key}:toolbarComplete`, this.actionModel.list.toolbars);
        });
    }

    /**
     * 初始化单项的Item的toolbar
     */
    initItemToolbar() {
        const menuTool: any = this.toolbarUtils.menuBuilder("", "md-icon-button").tooltipBuilder("操作菜单").iconBuilder("expand_more").menuOptionsBuilder().toValue();
        const keys = [];
        let itemActionsObj = _.keyBy(this.actionModel.itemActions, "key");

        // 提取所有的keys
        _.each(this.actionModel.itemActions, (item) => {
            keys.push(item.key);
        });
        // 处理所有提取的keys
        keys.length && this.fxAction.getModels(keys).then((actionModels) => {
            _.each(keys, (key) => {
                let actionModel: IActionModel = actionModels[key];
                if (actionModel) {
                    let condition = itemActionsObj[key].condition;
                    // 添加操作按钮
                    switch (actionModel.type) {
                        case ActionType.none:
                        case ActionType.form:
                        case ActionType.wizard:
                        case ActionType.confirm:
                            let menu = this.toolbarUtils.menuItemBuilder(actionModel.title, null, true).tooltipBuilder("").noOptions(true, false).iconBuilder(actionModel.icon).btnClick(($event, item: any) => {
                                this.doClickActionMenu($event, actionModel, item);
                            });
                            // 处理显示/隐藏逻辑
                            if (condition) {
                                menu.conditionBuilder(condition);
                            }
                            menuTool.items.push(menu.toValue());
                            break;
                    }
                }
            });
            // 单挑数据的操作按钮数据
            menuTool.items.length && (this.actionModel.list.itemToolbars = [menuTool]);
            this.$rootScope.$broadcast(`${this.key}:itemToolbarComplete`, menuTool.items);
        });
    }

    /**
     * 更改排序回调
     * @param order
     */
    orderChange(order: string) {
        this.queryData.order = order;
        this.doSearch(this.queryData.where || {});
        this.orderFunc();
    }

    /**
     * 更改页码或者pageSize回调
     * @param page
     * @param limit
     */
    pageChange(page: number, limit: number) {
        if (limit !== this.queryData.limit) {
            page = 1;
        }
        this.queryData.page = page;
        if (page > 0) {
            this.queryData.offset = (page - 1) * limit;
        }
        this.doSearch(this.queryData.where || {});
    }

    /**
     * 搜索数据
     * @param filterData {Object} 搜索数据
     */
    doSearch(filterData?: any) {
        // 如果是本地模式，则不调用网络请求
        if (this.local) {
            return;
        }

        this.isBusy = true;
        this.queryData.where = filterData || {};

        if (_.isObject(this._filter) && _.isObject(this.queryData["where"])) {
            _.extend(this.queryData["where"], this._filter);
        }

        this.promise = this.fxAction.doAction(this.key, this.queryData);

        if (!this.promise) {
            return;
        }
        this.promise.then((result) => {
            this.fxAction.doDealResult(this.actionModel, result, this.clientData);
            this.$rootScope.$broadcast(`${this.key}:searchComplete`, this.clientData);
        }).finally(() => {
            this.isBusy = false;
        });
    }
}

/**
 * 操作指令,某个表单操作
 * @returns {{restrict: string, template: any, scope: {}, replace: boolean, link: (($scope:IDirectiveScope))}}
 * @constructor
 */
function Directive(): ng.IDirective {
    return {
        restrict: 'EA',
        template: require("../tpls/list.jade")(),
        scope: true,
        bindToController: {
            key: "@",
            selected: '=?',
            _filter: '=?filter',
            clientData: '=?',
            showToolbar: '=?',
            multiple: '=?',
            autoSelect: '=?',
            local: '=?',
            itemToolbars: '=?',
            topToolbars: '=?',
            qtCtl: '=?'
        },
        controller: Controller,
        controllerAs: 'listCtl',
        replace: true,
        transclude: true
    };
}

module.filter('skip', function () {
    return (inputArray, skip, isLocal) => {
        if (!inputArray) return [];

        if (skip && isLocal) {
            return _.drop(inputArray.concat([]), skip);
        }

        return inputArray;
    }
});

module.directive("fxListAction", Directive);