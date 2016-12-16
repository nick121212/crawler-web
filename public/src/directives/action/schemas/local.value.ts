import { module } from '../module';
import { IActionModel, ActionType } from '../models/action.model';
import { MethodType } from '../models/interface.model';

class ListSchema {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "schemaCommonfx-1";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: ListSchema.key,
            type: ActionType.none,
            interfaces: [{
                key: "modulesList",
                method: MethodType.GET,
                address: "",
                port: null,
                path: "schemas",
                jpp: {
                    set: [{ "from": "/count", "to": "/total" }, { "from": "/rows", "to": "/rows" }]
                },
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class ListAction {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "actionCommonfx-1";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: ListAction.key,
            type: ActionType.none,
            interfaces: [{
                key: "actionList",
                method: MethodType.GET,
                address: "",
                port: null,
                path: "/actions/manual/opera",
                jpp: {
                    set: [{ "from": "/count", "to": "/total" }, { "from": "/rows", "to": "/rows" }]
                },
                isRestful: false
            }]
        };

        return actionModel;
    }
}

class ConfigAction {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "configAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: ConfigAction.key,
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

const services: Array<any> = [ListSchema, ListAction, ConfigAction];

_.each(services, (ser) => {
    module.service(ser.key, ser);
});