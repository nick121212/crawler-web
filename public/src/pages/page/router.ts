/**
 * Created by NICK on 16/8/9.
 */

import { PageController } from './ctls/page.controller';
import { D3Controller } from './ctls/page.d3.controller';
import { AllInController } from './ctls/page.allin.controller';
import { PageExecuteCmdController } from './ctls/page.execute.cmd';

export const initRouter = ($urlRouterProvider, $stateProvider) => {
    // 路由规则
    $stateProvider.state("home.page", {
        url: "page/:key",
        data: {
            permissions: {
                except: ["anonymous"],
                only: ["user"]
            }
        },
        views: {
            "content": {
                controller: PageController,
                controllerAs: "pageCtl",
                template: require("./tpls/page.template.jade")()
            }
        }
    }).state('home.d3', {
        url: "d3/:key",
        views: {
            "content": {
                controller: D3Controller,
                controllerAs: "pageCtl",
                template: require("./tpls/page.d3.template.jade")()
            }
        }
    }).state('home.allin', {
        url: "allin/:key",
        views: {
            "content": {
                controller: AllInController,
                controllerAs: "pageCtl",
                template: require("./tpls/page.allin.template.jade")()
            }
        }
    }).state('home.executeCmd', {
        url: "executeCmd/:key",
        views: {
            "content": {
                controller: PageExecuteCmdController,
                controllerAs: "pageCtl",
                template: require("./tpls/page.execute.cmd.jade")()
            }
        }
    });
};