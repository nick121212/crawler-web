import { IActionModel, ActionType } from '../../../directives/action/models/action.model';
import { MethodType } from '../../../directives/action/models/interface.model';

/**
 * 模块查询
 */
class List {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "crawlerSettingListAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: List.key,
            type: ActionType.list,
            title: "爬虫配置文件管理",
            icon: "content-save-settings",
            list: {
                columns: [
                    actionUtils.columnBuilder("<span>{{::item.key}}</span>", "KEY").toValue(),
                    actionUtils.columnBuilder("<span>{{ ::item.host }}</span>", "域名").toValue(),
                    actionUtils.columnBuilder("<span>{{ ::item.interval }}</span>", "间隔时间").toValue(),
                    actionUtils.columnBuilder(`<span>{{ ::item.downloader }}</span>`, "下载策略").toValue(),
                    actionUtils.columnBuilder(`<span>{{ ::item.description }}</span>`, "详情").toValue()
                ],
                showPagination: true,
                searchActionKey: Search.key,
                showRefreshBtn: true,
                showSearchBtn: true,
                showSearchPanel: false
            },
            itemActions: [{ key: Edit.key }, { key: Delete.key }, { key: Copy.key }],
            actions: [Add.key],
            interfaces: [{
                key: "crawlerSettingList",
                method: MethodType.GET,
                address: "",
                port: null,
                path: "crawler_settings",
                jpp: {
                    set: [{ "from": "/total", "to": "/count" }, { "from": "/rows", "to": "/rows" }]
                },
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class AddFirst {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "crawlerSettingAddFirstAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: AddFirst.key,
            type: ActionType.form,
            title: "基础设置",
            icon: "add",
            form: {
                dataSchema: "crawlerActionData",
                formSchema: "crawlerAddFirstActionForm"
            }
        };

        return actionModel;
    }
}

class AddSecond {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "crawlerSettingAddSecondAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: AddSecond.key,
            type: ActionType.form,
            title: "白名单设置",
            icon: "add",
            form: {
                dataSchema: "crawlerActionData",
                formSchema: "crawlerAddSecondActionForm"
            }
        };

        return actionModel;
    }
}

class AddThird {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "crawlerSettingAddThirdAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: AddThird.key,
            type: ActionType.form,
            title: "其他设置",
            icon: "add",
            form: {
                dataSchema: "crawlerActionData",
                formSchema: "crawlerAddThirdActionForm"
            }
        };

        return actionModel;
    }
}

class AddForth {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "crawlerSettingAddForthAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: AddForth.key,
            type: ActionType.form,
            title: "页面配置1",
            icon: "add",
            form: {
                dataSchema: "crawlerActionData",
                formSchema: "crawlerAddForthActionForm"
            }
        };

        return actionModel;
    }
}

class AddFifth {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "crawlerSettingAddFifthAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: AddFifth.key,
            type: ActionType.form,
            title: "页面配置2",
            icon: "add",
            form: {
                dataSchema: "crawlerActionData",
                formSchema: "crawlerAddFifthActionForm"
            }
        };

        return actionModel;
    }
}

class Add {
    static key: string = "crawlerSettingAddAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Add.key,
            type: ActionType.wizard,
            title: "新建爬虫配置文件",
            icon: "add",
            refreshList: true,
            wizard: {
                actions: [AddFirst.key, AddSecond.key, AddThird.key, AddForth.key, AddFifth.key]
            },
            closeDialog: true,
            interfaces: [{
                key: "crawlerSettingAdd",
                method: MethodType.POST,
                address: "",
                port: null,
                path: "crawler_settings",
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Copy {
    static key: string = "crawlerSettingCopyAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Copy.key,
            type: ActionType.wizard,
            title: "复制爬虫配置文件",
            icon: "content_copy",
            refreshList: true,
            wizard: {
                defaultSchema: {
                    dataSchema: "crawlerActionData",
                },
                actions: [AddFirst.key, AddSecond.key, AddThird.key, AddForth.key, AddFifth.key]
            },
            closeDialog: true,
            interfaces: [{
                key: "crawlerSettingAdd",
                method: MethodType.POST,
                address: "",
                port: null,
                path: "crawler_settings",
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Edit {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "crawlerSettingEditAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: Edit.key,
            type: ActionType.wizard,
            title: "修改爬虫配置文件",
            icon: "edit",
            refreshList: true,
            wizard: {
                defaultSchema: {
                    dataSchema: "crawlerActionData",
                },
                actions: [AddFirst.key, AddSecond.key, AddThird.key, AddForth.key, AddFifth.key]
            },
            closeDialog: true,
            interfaces: [{
                key: "crawlerSettingEdit",
                method: MethodType.PUT,
                idFieldPath: "/key",
                address: "",
                port: null,
                path: "crawler_settings",
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Delete {
    static key: string = "crawlerSettingDeleteAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Delete.key,
            type: ActionType.confirm,
            title: "删除爬虫配置文件",
            icon: "delete",
            refreshList: true,
            confirm: {
                confirmTitle: "",
                confirmContent: "确定要删除爬虫配置文件吗!"
            },
            interfaces: [{
                key: "crawlerSettingDelete",
                method: MethodType.DELETE,
                idFieldPath: "/key",
                address: "",
                port: null,
                path: "crawler_settings",
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Search {
    static key: string = "crawlerSettingSearchAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Search.key,
            type: ActionType.form,
            title: "搜索爬虫配置文件",
            icon: "search",
            form: {
                dataSchema: "crawlerActionData",
                formSchema: [{
                    key: "key",
                    type: "text",
                    required: false,
                    copyValueTo: ["/key/$eq"],
                    htmlClass: "md-block"
                }]
            }
        };

        return actionModel;
    }
}

class Ack {
    static key: string = "crawlerSettingAckAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Ack.key,
            type: ActionType.form,
            title: "爬虫命令",
            icon: "apple-keyboard-command",
            form: {
                dataSchema: "crawlerAckActionData",
                formSchema: "crawlerAckActionForm"
            }
        };

        return actionModel;
    }
}

export default (module: ng.IModule) => {
    const services: Array<any> = [List, Search, Add, Edit, Delete, Copy, Ack, AddFirst, AddSecond, AddThird, AddForth, AddFifth];

    _.each(services, (ser) => {
        module.service(ser.key, ser);
    });
}
