export default (app) => {
    return async(ctx, next) => {
        if (ctx.isAuthenticated()) {
            await next();
        } else {
            ctx.redirect('/passport/login');
        }
    };
};