import * as _ from 'lodash';

/**
 * 管理中间件类
 * 执行中间件
 */
export class Middleware {
    constructor() {

    }

    error(app) {
        return async(ctx, next) => {
            try {
                await next();
                if (ctx.status === 404) ctx.throw(404);
            } catch (err) {
                if (err.isBoom) {
                    ctx.status = err.output.statusCode;
                } else {
                    ctx.status = err.status || 500;
                }
                ctx.body = {
                    msg: err.body || err.message,
                    status: ctx.status,
                    url: ctx.url,
                    stack: err.stack + "\n"
                };
                console.log(err);
            }
        };
    }

    async execute(config, app) {
        app.use(this.error());
        _.each(config.order, (key) => {
            let middleware = config.middlewares[key];
            try {
                let module = require(key);

                if (module.default) {
                    module = module.default;
                }
                if (middleware) {
                    if (_.isArray(middleware)) {
                        return app.use(module.apply(app, middleware));
                    }

                    if (_.isFunction(middleware)) {
                        return middleware(app, module);
                    }
                }

                app.use(module.apply(app, []));
            } catch (e) {
                middleware = config.custom[key];
                return middleware && middleware(app);
            }
        });
    }
}


export default new Middleware();