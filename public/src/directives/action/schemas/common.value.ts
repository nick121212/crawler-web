import { module } from '../module';
import { IActionModel, ActionType } from '../models/action.model';
import { MethodType } from '../models/interface.model';

/**
 * 模块查询
 */
class Config {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "configAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: Config.key,
            type: ActionType.none,
            interfaces: [{
                key: "configAction",
                method: MethodType.GET,
                address: "",
                port: null,
                path: "/home/config",
                isRestful: false
            }]
        };

        return actionModel;
    }
}

/**
 * 模块查询
 */
class Result {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "resultAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: Result.key,
            type: ActionType.form,
            title: "结果反馈",
            icon: "view-module",
            form: {
                dataSchema: "resultActionData",
                formSchema: "resultActionForm"
            }
        };

        return actionModel;
    }
}

const services: Array<any> = [Result, Config];

_.each(services, (ser) => {
    module.service(ser.key, ser);
});

