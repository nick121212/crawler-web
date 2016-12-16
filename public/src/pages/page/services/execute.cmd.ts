import { IActionModel, ActionType } from '../../../directives/action/models/action.model';
import { MethodType } from '../../../directives/action/models/interface.model';

export class ExecuteCmdForm {
    static key: string = "execute.cmd";

    constructor() {
        let actionModel: IActionModel = {
            key: ExecuteCmdForm.key,
            type: ActionType.form,
            title: "",
            icon: "",
            form: {
                dataSchema: {
                    type: "object",
                    required: ["command", "listIps"],
                    properties: {
                        command: {
                            type: "object",
                            title: "命令"
                        },
                        listIps: {
                            type: "array",
                            default: [],
                            title: "服务器列表",
                            minItems: 1,
                            items: {
                                type: "object"
                            }
                        }
                    }
                },
                formSchema: [{
                    key: "command",
                    type: "autocomplete-1",
                    placeHolder: "请选择命令",
                    acOptions: {
                        textField: "title",
                        // keyField: "key",
                        dataField: "rows",
                        noCache: true,
                        fields: [{ key: ["key"] }, { key: ["args"] }, { key: ["description"] }, { key: ["title"] }, { key: ["cmd"] }],
                        search: "/where/key/$like",
                        actionKey: "command"
                    },
                    htmlClass: "md-block"
                }, {
                    key: "command.args[0]",
                    type: "text",
                    required: true,
                    title: "命令参数",
                    htmlClass: "md-block"
                }, {
                    key: "listIps",
                    type: "querytable",
                    qtOptions: {
                        key: "devices"
                    },
                    startEmpty: true,
                    htmlClass: "md-block"
                }]
            },
            refreshList: true,
            closeDialog: true,
            interfaces: [{
                key: "execute.cmd",
                method: MethodType.POST,
                address: "",
                // port: "",
                path: "/commands/manual/test",
                jpp: {
                    set: [{ "from": "/queueItem", "to": "/data" }]
                },
                // config: {
                //     salt: true
                // },
                isRestful: false
            }]
        };

        return actionModel;
    }
}

export default (module: ng.IModule) => {
    const services = [ExecuteCmdForm];

    _.each(services, (model) => {
        module.service(model.key, model);
    });
}
