import { module } from '../module';
import { IActionModel } from '../models/action.model';
import * as _ from 'lodash';
import * as pointer from 'json-pointer';

const _name = "fxSearchAction";

class Controller {
    static $inject = ["fxAction", "toolbarUtils"];

    key: string;
    formData: any;
    actionModel: IActionModel;
    disabled: boolean;
    toolbars: Array<any>;
    isShow: boolean;
    doSearch: Function;

    constructor(private fxAction, private toolbarUtils) {
        this.initSearchToolbar();
        this.formData = this.formData || {};
    }

    /**
     * 删除搜索字段
     */
    clearFilterData() {
        _.forEach(this.formData, (val, key) => {
            delete this.formData[key];
        });
    }

    /**
     * 初始化搜索toolbar
     */
    initSearchToolbar() {
        this.toolbars = [
            this.toolbarUtils.labelBuilder('{{searchCtl.title}}搜索').attrBuilder({ flex: "" }).toValue(),
            this.toolbarUtils.btnBuilder("清空搜索条件", "md-icon-button", false).iconBuilder("clear_all").btnClick(($event) => {
                this.clearFilterData();
            }).toValue(),
            this.toolbarUtils.btnBuilder("关闭搜索栏", "md-icon-button", false).iconBuilder("{{searchCtl.isShow?'window-open':'window-closed'}}").btnClick(($event) => {
                this.isShow = !this.isShow;
            }).toValue()
        ];
    }

    /**
     * 搜索数据
     * @param $event
     * @param $form
     */
    doPreSearch($event, $form: ng.IFormController) {
        const searchData = {};

        if (this.fxAction.doFormCheck($form) && _.isFunction(this.doSearch)) {
            _.forEach(this.formData, (data, key: string) => {
                if (key.substr(0, 1) === "/") {
                    if (!_.isNull(data) && !_.isUndefined(data) && data !== "") {
                        pointer.set(searchData, key, data);
                    } else {
                        pointer.has(searchData, key) && pointer.remove(searchData, key);
                    }
                }
            });

            // if (_.isObject(this.filter) && _.isObject(searchData["where"])) {
            //     _.extend(searchData["where"], this.filter);
            // }

            this.doSearch(searchData);
        }
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
        template: require("../tpls/search.jade")(),
        bindToController: {
            formData: "=ngModel",
            key: "@",
            disabled: '=',
            isShow: '=',
            doSearch: '=?',
            title: '=?'
        },
        require: `^${_name}`,
        controller: Controller,
        controllerAs: 'searchCtl',
        replace: true
    };
}

module.directive(_name, Directive);
