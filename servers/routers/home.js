import Router from 'koa-better-router';
import config from '../config';
import auth from '../auth';
import _ from 'lodash';

export default (app) => {
    let router = Router({
        prefix: '/home'
    });

    router.addRoute('GET /config', [auth.passport(app), (ctx) => {
        ctx.body = {
            config: config.site
        };
    }]);

    router.addRoute('GET /userinfo', [auth.passport(app), (ctx) => {
        ctx.body = _.extend(_.pick(ctx.req.user, ['username', 'id']), {
            __event: "userinfo"
        });
    }]);

    return router;
};