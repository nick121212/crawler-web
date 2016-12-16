/**
 * Created by NICK on 16/8/9.
 */

import {TtyController} from './ctls/index.controller';

export const initRouter = ($urlRouterProvider, $stateProvider) => {
    // 路由规则
    $stateProvider.state("home.tty", {
        url: "tty/:key",
        data: {
            permissions: {
                except: ["anonymous"],
                only: ["user"]
            }
        },
        views: {
            "content": {
                controller: TtyController,
                controllerAs: "ttyCtl",
                template: require("./tpls/index.template.jade")()
            }
        }
    });
};