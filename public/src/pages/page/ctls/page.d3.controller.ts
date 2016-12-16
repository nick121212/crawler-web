/**
 * Created by NICK on 16/8/10.
 */

import * as _ from 'lodash';
import { Force } from '../d3/force.d3';
import { IActionModel, ActionType, IClientData } from '../../../directives/action/models/action.model';

export class D3Controller {
    static $inject = ["$stateParams", "fxAction", "toolbarUtils", "materialUtils"];

    isBusy: boolean;
    actionModel: IActionModel;
    private key: string;
    clientData: IClientData;

    constructor(private $stateParams: ng.ui.IStateParamsService, private fxAction, private toolbarUtils, private materialUtils) {
        // new Force("#paged3");
        this.clientData = {};
        this.key = $stateParams["key"];
        this.doInit();
    }

    /**
     * 按钮事件
     */
    doClickActionMenu($event, actionModel, item) {
        this.fxAction.doActionModel($event, actionModel, item).then((result) => {
            this.materialUtils.showMsg(`${actionModel.successMsg || "操作成功!"}`);
            if (actionModel.refreshList) {

            }
        });
    }

    /**
     * 获取数据
     */
    doGetData() {
        let promise = this.fxAction.doAction(this.key, { limit: 100, where: {} });

        if (!promise) {
            return;
        }
        this.isBusy = true;
        promise.then((result) => {
            return this.fxAction.doDealResult(this.actionModel, result, this.clientData);
        }).then((results) => {


        }).finally(() => {
            this.isBusy = false;
            setTimeout(() => {
                new Force("#paged3", this.clientData.rows);
            }, 200);
        });
    }

    /**
     * 初始化数据，按钮组
     */
    doInit() {
        this.fxAction.getModel(this.key).then((actionModel) => {
            this.actionModel = actionModel;
            this.actionModel.list.toolbars = [];
            this.doGetData();

            return this.fxAction.getModels(this.actionModel.actions);
        }).then((actionModels) => {
            _.forEach(actionModels, (actionModel: IActionModel) => {
                if (actionModel.type !== ActionType.list) {
                    this.actionModel.list.toolbars.push(this.toolbarUtils.btnBuilder(actionModel.title, "md-fab md-raised md-mini", false).tooltipBuilder("").iconBuilder(actionModel.icon, { fill: "black" }).btnClick(($event, item: any) => {
                        this.doClickActionMenu($event, actionModel, item || {});
                    }).toValue());
                }
            });
            if (this.actionModel.list.showRefreshBtn) {
                this.actionModel.list.toolbars.push(this.toolbarUtils.btnBuilder("刷新", "md-fab md-raised md-mini", false).iconBuilder("refresh", { fill: "black" }).btnClick(($event) => {
                    this.doGetData();
                }).toValue());
            }
        });
    }
}