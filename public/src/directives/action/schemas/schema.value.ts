import { module } from '../module';
import { IActionModel, ActionType } from '../models/action.model';
import { MethodType } from '../models/interface.model';

class List {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "schemaListAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: List.key,
            type: ActionType.list,
            title: "SCHEMA管理",
            icon: "view-module",
            list: {
                columns: [
                    actionUtils.columnBuilder("<span>{{::item.id}}</span>", "ID", "id").toValue(),
                    actionUtils.columnBuilder("<span>{{::item.key}}</span>", "KEY").toValue(),
                    actionUtils.columnBuilder("<span>{{::item.group}}</span>", "分组名称", "group").toValue(),
                    actionUtils.columnBuilder("<span>{{ ::item.type }}</span>", "模块类型").toValue(),
                    actionUtils.columnBuilder(`<span>{{ ::item.description }}</span>`, "描述").toValue(),
                ],
                queryData: { limit: 50 },
                showPagination: true,
                searchActionKey: Search.key,
                showRefreshBtn: true,
                showSearchBtn: true,
                showSearchPanel: false,
                toolbars: [],
                itemToolbars: []
            },
            itemActions: [{ key: Edit.key }, { key: Delete.key }, { key: Copy.key }],
            actions: [Add.key],
            interfaces: [{
                key: "modulesList",
                method: MethodType.GET,
                address: "",
                port: null,
                path: "schemas",
                jpp: {
                    set: [{ "from": "/total", "to": "/count" }, { "from": "/rows", "to": "/rows" }]
                },
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Add {
    static key: string = "schemaAddAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Add.key,
            type: ActionType.form,
            title: "新建SCHEMA",
            icon: "add",
            refreshList: true,
            form: {
                dataSchema: "schemaActionData",
                formSchema: "schemaAddActionForm"
            },
            closeDialog: true,
            interfaces: [{
                key: "schemaAdd",
                method: MethodType.POST,
                address: "",
                port: null,
                path: "schemas",
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Edit {
    static key: string = "schemaEditAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Edit.key,
            type: ActionType.form,
            title: "修改SCHEMA",
            icon: "edit",
            refreshList: true,
            form: {
                dataSchema: "schemaActionData",
                formSchema: "schemaAddActionForm"
            },
            closeDialog: true,
            interfaces: [{
                key: "schemaEdit",
                method: MethodType.PUT,
                idFieldPath: "/id",
                address: "",
                port: null,
                path: "schemas",
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Copy {
    static key: string = "schemaCopyAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Copy.key,
            type: ActionType.form,
            title: "复制SCHEMA",
            icon: "content_copy",
            refreshList: true,
            form: {
                dataSchema: "schemaActionData",
                formSchema: "schemaAddActionForm"
            },
            closeDialog: true,
            interfaces: [{
                key: "schemaAdd",
                method: MethodType.POST,
                address: "",
                port: null,
                path: "schemas",
                jpp: {
                    del: ["/id"]
                },
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Delete {
    static key: string = "schemaDeleteAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Delete.key,
            type: ActionType.confirm,
            title: "删除SCHEMA",
            icon: "delete",
            refreshList: true,
            confirm: {
                confirmTitle: "",
                confirmContent: "确定要删除SCHEMA吗!"
            },
            interfaces: [{
                key: "schemaDelete",
                method: MethodType.DELETE,
                idFieldPath: "/id",
                address: "",
                port: null,
                path: "schemas",
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Search {
    static key: string = "schemaSearchAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Search.key,
            type: ActionType.form,
            title: "搜索SCHEMA",
            icon: "search",
            form: {
                dataSchema: "schemaActionData",
                formSchema: "schemaSearchActionForm"
            }
        };

        return actionModel;
    }
}

const services: Array<any> = [List, Add, Edit, Delete, Copy, Search];

_.each(services, (ser) => {
    module.service(ser.key, ser);
});

