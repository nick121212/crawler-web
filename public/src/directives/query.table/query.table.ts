import { module } from './module';
import * as _ from 'lodash';

class Controller {
    key: string;
    clientData: any;
    itemToolbars: Array<any> = [];
    toolbars: Array<any> = [];
    topToolbars: Array<any> = [];
    layout: string = "row";
    closeFn: Function;
    showSearchTable: boolean = true;
    ngModel: Array<any>;
    _filter: any;

    constructor(private $scope, private fxAction, private toolbarUtils, private $mdDialog: ng.material.IDialogService, private materialUtils: fx.utils.materialStatic) {
        if (!this.clientData) {
            this.clientData = {};
        }

        // this.topToolbars.push(this.toolbarUtils.noneBuilder("icon").iconBuilder(this.actionModel.icon, { fill: "black" }).toValue());
        this.topToolbars.push(this.toolbarUtils.labelBuilder(`所选项目`).attrBuilder({ flex: "" }).toValue());
        this.itemToolbars.push(
            this.toolbarUtils.btnBuilder("删除", "md-icon-button", false).iconBuilder("delete", {}).btnClick(($event, item, index) => {
                this.clientData.rows.splice(index, 1);
            }).toValue()
        );
        this.closeFn && this.toolbars.push(
            this.toolbarUtils.btnBuilder("关闭", "md-icon-button", false).iconBuilder("close", {}).btnClick(($event, item, index) => {
                console.log(this.closeFn);
                this.closeFn && this.closeFn();
            }).toValue()
        );
        this.topToolbars.push(
            this.toolbarUtils.btnBuilder("改变布局方向", "md-icon-button", false).iconBuilder("{{listCtl.qtCtl.layout=='column'?'format-vertical-align-center':'format-horizontal-align-center'}}", {}).btnClick(($event, item, index) => {
                this.layout === "column" ? this.layout = "row" : this.layout = "column";
            }).toValue());
        this.topToolbars.push(
            this.toolbarUtils.btnBuilder("{{!listCtl.qtCtl.showSearchTable?'显示资产信息':'隐藏资产信息'}}", "md-icon-button", false).iconBuilder("{{!listCtl.qtCtl.showSearchTable?'arrow-down-bold-circle-outline':'arrow-up-bold-circle-outline'}}", {}).btnClick(($event, item, index) => {
                this.showSearchTable = !this.showSearchTable;
            }).toValue());
        this.topToolbars.push(
            this.toolbarUtils.btnBuilder("清空所有数据", "md-icon-button", false).iconBuilder("clear_all", {}).conditionBuilder("listCtl.qtCtl.clientData.rows.length", false).btnClick(($event, item, index) => {
                this.clientData.rows && (this.clientData.rows.length = 0);
            }).toValue());

        this.$scope.$watch(() => {
            return this.ngModel;
        }, (newValue) => {
            if (_.isArray(newValue)) {
                this.clientData.rows = newValue;
                this.clientData.count = this.clientData.rows.length;
            }
        });
    }
}

Controller.$inject = ["$scope", "fxAction", "toolbarUtils", "$mdDialog", "materialUtils"];

function Directive(): ng.IDirective {
    return {
        restrict: 'EA',
        scope: false,
        require: "^ngModel",
        transclude: true,
        bindToController: {
            key: '@fxQueryTable',
            closeFn: '&?closeFn',
            ngModel: '=?',
            _filter: '=?'
        },
        template: require("./tpls/query.table.jade"),
        controller: Controller,
        controllerAs: 'qtCtl',
        link: function ($scope, $element, $attrs, $ctrl) {

        }
    };
}

module.directive('fxQueryTable', Directive);