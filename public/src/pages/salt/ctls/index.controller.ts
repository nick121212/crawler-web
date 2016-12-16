import * as io from 'socket.io-client';
import * as _ from 'lodash';

export class SaltController {
    static $inject = ["$rootScope", "$scope", "$stateParams", "toolbarUtils", "materialUtils", "fxAction", "restUtils"];

    toolbar: Array<Object>;
    toolbarTest: Array<Object>;
    socket: SocketIOClient.Socket;

    constructor(private $rootScope: ng.IRootScopeService, private $scope: ng.IScope, private $stateParams: ng.ui.IStateParamsService, private toolbarUtils, private materialUtils: fx.utils.materialStatic, private fxAction, private restUtils: fx.utils.restStatic) {
        this.toolbar = [
            this.toolbarUtils.noneBuilder("icon").iconBuilder('power-socket', {}).toValue(),
            this.toolbarUtils.labelBuilder('SALT-API').attrBuilder({ flex: "" }).toValue()
        ];

        this.fxAction.getModels(["saltApiRun", "saltApiRun1", "saltApiStats", "saltApiLogin", "saltApiLogout", "saltApiMinions", "saltApiJobs"]).then((actionModels) => {
            this.toolbarTest = [];
            _.forEach(actionModels, (actionModel) => {
                this.toolbarTest.push(
                    this.toolbarUtils.btnBuilder(actionModel.title, "md-button", true).iconBuilder(actionModel.icon, {}).btnClick(($event) => {
                        this.fxAction.doActionModel($event, actionModel, null, (result) => {
                            return this.fxAction.getModel("resultAction").then((actionModelResult) => {
                                this.fxAction.doActionModel($event, actionModelResult, this.fxAction.doDealResult(actionModel, result, {}), () => {
                                    this.materialUtils.close();
                                });
                            });
                        });
                    }).toValue()
                );
            });
        });

        this.$rootScope.$on("saltLoginEvent", (event, data) => {
            this.initEvents(data);
        });
    }

    initEvents(data) {
        var source = new window["EventSource"]('https://172.16.140.164:8888/events/' + data.return[0].token);

        source.onopen = function () {
            console.debug('opening')
        };
        source.onerror = function (e) {
            console.debug('error!', e)
        };
        source.onmessage = function (e) {
            console.debug(e.data)
        };
    }
}
