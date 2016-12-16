import Router from 'koa-better-router';
import passport from 'koa-passport';
import boom from 'boom';
import auth from '../auth';

export default (app) => {
    let router = Router({
        prefix: `/passport`
    });

    router.addRoute('GET /login', [async(ctx, next) => {
        ctx.logout();
        throw boom.unauthorized("用户未登陆或没有权限!");
    }]);

    router.addRoute('POST /login', [passport.authenticate('local', {
        failureRedirect: `/passport/login`
    }), async(ctx, next) => {
        ctx.body = ctx.passport.user;
        await next();
    }]);

    router.addRoute('POST /logout', [async(ctx) => {
        ctx.logout();
        ctx.redirect(`/passport/login`);
    }]);

    return router;
};