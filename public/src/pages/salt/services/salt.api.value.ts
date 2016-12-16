import { IActionModel, ActionType } from '../../../directives/action/models/action.model';
import { MethodType } from '../../../directives/action/models/interface.model';

const ip = "https://172.16.140.164";
const port = 8888;

class Login {
    static key: string = "saltApiLogin";

    constructor() {
        let actionModel: IActionModel = {
            key: Login.key,
            type: ActionType.form,
            title: "登陆",
            icon: "login",
            form: {
                dataSchema: {
                    type: "object",
                    required: ["username", "password"],
                    properties: {
                        username: {
                            type: "string",
                            minLength: 4,
                            maxLength: 20,
                            title: "用户名"
                        },
                        eauth: {
                            type: "string",
                            default: "pam"
                        },
                        password: {
                            type: "string",
                            title: "密码",
                            minLength: 4,
                            maxLength: 20
                        }
                    }
                },
                formSchema: [{
                    key: "username",
                    type: "string",
                    placeHolder: "用户名",
                    icon: {
                        leftIcon: "account"
                    },
                    htmlClass: "md-icon-left md-block"
                }, {
                    key: "password",
                    type: "password",
                    icon: {
                        leftIcon: "lock"
                    },
                    htmlClass: "md-icon-left md-block"
                }]
            },
            refreshList: true,
            closeDialog: true,
            interfaces: [{
                key: "saltApiLogin",
                method: MethodType.POST,
                address: ip,
                port: port,
                path: "login",
                jpp: {
                    set: [{ "from": "/return", "to": "/data" }]
                },
                header: {
                    set: [{
                        "from": "/return/0/token", "to": "/X-Auth-Token"
                    }]
                },
                config: {
                    salt: true
                },
                isRestful: false
            }]
        };

        return actionModel;
    }
}

class Logout {
    static key: string = "saltApiLogout";

    constructor() {
        let actionModel: IActionModel = {
            key: Logout.key,
            type: ActionType.confirm,
            title: "salt退出登录",
            icon: "logout",
            refreshList: true,
            confirm: {
                confirmTitle: "",
                confirmContent: "确定要退出登录吗!"
            },
            interfaces: [{
                key: "saltApiLogin",
                method: MethodType.POST,
                address: ip,
                port: port,
                path: "logout",
                jpp: {
                    set: [{ "from": "/return", "to": "/data" }]
                },
                config: {
                    salt: true
                },
                isRestful: false
            }]
        };

        return actionModel;
    }
}

class Minions {
    static key: string = "saltApiMinions";

    constructor() {
        let actionModel: IActionModel = {
            key: Minions.key,
            type: ActionType.confirm,
            title: "所有CLIENT",
            icon: "client",
            refreshList: true,
            confirm: {
                confirmTitle: "",
                confirmContent: "获取minions!"
            },
            interfaces: [{
                key: "saltApiMinions",
                method: MethodType.GET,
                address: ip,
                port: port,
                path: "minions",
                jpp: {
                    set: [{ "from": "/return", "to": "/data" }]
                },
                config: {
                    salt: true
                },
                isRestful: false
            }]
        };

        return actionModel;
    }
}

class Jobs {
    static key: string = "saltApiJobs";

    constructor() {
        let actionModel: IActionModel = {
            key: Jobs.key,
            type: ActionType.confirm,
            title: "所有JOBS",
            icon: "client",
            refreshList: true,
            confirm: {
                confirmTitle: "",
                confirmContent: "获取JOBS!"
            },
            interfaces: [{
                key: "saltApiJobs",
                method: MethodType.GET,
                address: ip,
                port: port,
                path: "jobs",
                jpp: {
                    set: [{ "from": "/return", "to": "/data" }]
                },
                config: {
                    salt: true
                },
                isRestful: false
            }]
        };

        return actionModel;
    }
}

class Events {
    static key: string = "saltApiEvents";

    constructor() {
        let actionModel: IActionModel = {
            key: Events.key,
            type: ActionType.confirm,
            title: "所有EVENTS",
            icon: "client",
            refreshList: true,
            confirm: {
                confirmTitle: "",
                confirmContent: "获取EVENTS!"
            },
            interfaces: [{
                key: "saltApiEvents",
                method: MethodType.GET,
                address: ip,
                port: port,
                path: "events",
                jpp: {
                    set: [{ "from": "/return", "to": "/data" }]
                },
                config: {
                    salt: true
                },
                isRestful: false
            }]
        };

        return actionModel;
    }
}

class Stats {
    static key: string = "saltApiStats";

    constructor() {
        let actionModel: IActionModel = {
            key: Stats.key,
            type: ActionType.confirm,
            title: "所有Stats",
            icon: "client",
            refreshList: true,
            confirm: {
                confirmTitle: "",
                confirmContent: "获取Stats!"
            },
            interfaces: [{
                key: "saltApiStats",
                method: MethodType.GET,
                address: ip,
                port: port,
                path: "stats",
                jpp: {
                    set: [{ "from": "/return", "to": "/data" }]
                },
                config: {
                    salt: true
                },
                isRestful: false
            }]
        };

        return actionModel;
    }
}

class Run {
    static key: string = "saltApiRun";

    constructor() {
        let actionModel: IActionModel = {
            key: Run.key,
            type: ActionType.form,
            title: "执行命令",
            icon: "run",
            form: {
                dataSchema: {
                    type: "object",
                    required: ["client"],
                    properties: {
                        username: {
                            type: "string",
                            title: "用户名",
                            default: "saltapi"
                        },
                        eauth: {
                            type: "string",
                            default: "pam"
                        },
                        password: {
                            type: "string",
                            title: "密码",
                            default: "saltapi",
                            minLength: 4,
                            maxLength: 20
                        },
                        client: {
                            type: "string",
                            default: "local"
                        },
                        tgt: {
                            type: "string",
                            default: "*"
                        },
                        fun: {
                            type: "string",
                            default: "test.ping"
                        }
                    }
                },
                formSchema: [{
                    key: "client",
                    type: "text"
                }, {
                    key: "tgt",
                    type: "text"
                }, {
                    key: "fun",
                    type: "text"
                }]
            },
            refreshList: true,
            closeDialog: true,
            interfaces: [{
                key: "saltApiRun",
                method: MethodType.POST,
                address: ip,
                port: port,
                path: "run",
                jpp: {
                    set: [{ "from": "/return", "to": "/data" }]
                },
                config: {
                    salt: true
                },
                isRestful: false
            }]
        };

        return actionModel;
    }
}

class Run1 {
    static key: string = "saltApiRun1";

    constructor() {
        let actionModel: IActionModel = {
            key: Run1.key,
            type: ActionType.form,
            title: "执行命令-1",
            icon: "run",
            form: {
                dataSchema: {
                    type: "object",
                    required: ["client"],
                    properties: {
                        mode: {
                            type: "string",
                            default: "async"
                        },
                        tgt: {
                            type: "string",
                            default: "*"
                        },
                        fun: {
                            type: "string",
                            default: "test.ping"
                        },
                        arg: {
                            "type": "array",
                            "title": "参数",
                            "default": [],
                            "items": {
                                "type": "string",
                                "title": "参数"
                            }
                        }
                    }
                },
                formSchema: [{
                    key: "tgt",
                    type: "text"
                }, {
                    key: "fun",
                    type: "text"
                }, {
                    key: "arg",
                    startEmpty: true,
                    type: "chips"
                }]
            },
            refreshList: true,
            closeDialog: true,
            interfaces: [{
                key: "saltApiRun",
                method: MethodType.POST,
                address: ip,
                port: port,
                path: "minions",
                jpp: {
                    set: [{ "from": "/return", "to": "/data" }]
                },
                config: {
                    salt: true
                },
                isRestful: false
            }]
        };

        return actionModel;
    }
}

export default (module: ng.IModule) => {
    const services = [Login, Logout, Minions, Jobs, Events, Stats, Run, Run1];

    _.each(services, (model) => {
        module.service(model.key, model);
    });
}
