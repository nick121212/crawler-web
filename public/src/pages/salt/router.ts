/**
 * Created by NICK on 16/8/9.
 */

import {SaltController} from './ctls/index.controller';

export const initRouter = ($urlRouterProvider, $stateProvider) => {
    // 路由规则
    $stateProvider.state("home.salt", {
        url: "salt/:key",
        data: {
            permissions: {
                except: ["anonymous"],
                only: ["user"]
            }
        },
        views: {
            "content": {
                controller: SaltController,
                controllerAs: "saltCtl",
                template: require("./tpls/index.template.jade")()
            }
        }
    });
};