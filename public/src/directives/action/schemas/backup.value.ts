import { module } from '../module';
import { IActionModel, ActionType } from '../models/action.model';
import { MethodType } from '../models/interface.model';

class List {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "backupListAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: List.key,
            type: ActionType.list,
            title: "数据库备份文件管理",
            icon: "backup",
            list: {
                columns: [
                    actionUtils.columnBuilder("<a target='_blank' href='/backups/{{ ::item }}'>{{::item}}</a>", "文件名称").toValue(),
                    actionUtils.columnBuilder("<span>{{::item.replace('.sql','') | date: 'yyyy-MM-dd HH:mm:ss Z'}}</span>", "备份时间").toValue(),
                ],
                showPagination: false,
                searchActionKey: "",
                showRefreshBtn: true,
                showSearchBtn: true,
                showSearchPanel: false,
                toolbars: [],
                itemToolbars: []
            },
            itemActions: [{ key: Delete.key }, { key: Dump.key }],
            actions: [Backup.key],
            interfaces: [{
                key: "backupList",
                method: MethodType.GET,
                address: "",
                port: null,
                path: "backups",
                jpp: {
                    set: [{ "from": "", "to": "/rows" }]
                },
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Backup {
    static key: string = "backupBackupAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Backup.key,
            type: ActionType.confirm,
            title: "备份数据库文件",
            icon: "backup",
            refreshList: true,
            confirm: {
                confirmTitle: "",
                confirmContent: "确定要备份此文件吗!"
            },
            interfaces: [{
                key: "backupDump",
                method: MethodType.POST,
                idFieldPath: "",
                address: "",
                port: null,
                path: "backups",
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Delete {
    static key: string = "backupDeleteAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Delete.key,
            type: ActionType.confirm,
            title: "删除备份数据库文件",
            icon: "delete",
            refreshList: true,
            confirm: {
                confirmTitle: "",
                confirmContent: "确定要删除备份文件吗!"
            },
            interfaces: [{
                key: "backupDelete",
                method: MethodType.DELETE,
                idFieldPath: "",
                address: "",
                port: null,
                path: "backups",
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Dump {
    static key: string = "backupDumpAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Dump.key,
            type: ActionType.confirm,
            title: "还原文件",
            icon: "backup",
            refreshList: true,
            confirm: {
                confirmTitle: "",
                confirmContent: "确定要还原此文件吗!"
            },
            interfaces: [{
                key: "backupDump",
                method: MethodType.PUT,
                params: false,
                idFieldPath: "",
                address: "",
                port: null,
                path: "backups",
                isRestful: true
            }]
        };

        return actionModel;
    }
}

class Download {
    static key: string = "backupDownloadAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Download.key,
            type: ActionType.form,
            title: "上传文件",
            icon: "upload",
            refreshList: true,

            interfaces: [{
                key: "backupDownload",
                method: MethodType.GET,
                idFieldPath: "",
                params: true,
                address: "",
                port: null,
                path: "backups",
                isRestful: true
            }]
        };

        return actionModel;
    }
}

const services = [List, Dump, Delete, Backup, Download];

_.each(services, (model) => {
    module.service(model.key, model);
});

