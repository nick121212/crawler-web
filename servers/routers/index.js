import db from '../utils/db';
import Router from 'koa-better-router';
import _ from 'lodash';
import fs from 'fs';

import homeRoute from './home';
import passportRoute from './passport';

export class BRouter {
    constructor() {

    }

    execute(app) {
        this.doInitModelRouter(app);
        this.doInitOtherRoute(app);
    }

    doInitRouter(key, router, model) {
        if (fs.existsSync(__dirname + `/../controllers/${key}`)) {
            try {
                let controller = require(`../controllers/${key}`);

                try {
                    _.forEach(controller.routers, (route, routerKey) => {
                        router.addRoute(routerKey, _.map(route, (func) => {
                            return func(model, controller.config || {});
                        }));
                    });

                    if (_.isFunction(controller.init)) {
                        controller.init(router, model);
                    }
                } catch (err) {
                    console.error(err);
                }
            } catch (err) {
                console.error(err);
            }
        }

        return router;
    }

    doInitModelRouter(app) {
        this.routers = {};

        _.each(db.models, (model) => {
            let router = Router({
                prefix: `/${model.name}s`
            });

            this.doInitRouter(model.name, router, model);
            this.doInitRouter('common', router, model);
            this.routers[model.name] = router;

            app.use(router.middleware());
        });
    }

    doInitOtherRoute(app) {
        app.use(homeRoute(app).middleware());
        app.use(passportRoute(app).middleware());

        app.use(this.doInitRouter("backup", Router({
            prefix: `/backups`
        }), {}).middleware());
        app.use(this.doInitRouter("device", Router({
            prefix: `/devices`
        }), {}).middleware());
    }
}

export const router = new BRouter();