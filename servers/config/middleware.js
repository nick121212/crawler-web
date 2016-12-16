import { RedisStore } from './store';
import { Strategy } from 'passport-local';
import db from '../utils/db';
import crypto from "crypto-browserify";

export default (config) => {
    return {
        middlewares: {
            'koa-better-error-handler': (app, errorHandler) => {
                app.context.onerror = errorHandler;
            },
            'koa-better-body': [{
                fields: "body",
                files: true,
                // querystring: require('qs')
            }],
            'koa-methodoverride': [],
            'koa-compress': [{
                filter: (content_type) => {
                    return /text/i.test(content_type)
                },
                threshold: 2048,
                flush: require('zlib').Z_SYNC_FLUSH
            }],
            'koa-passport': (app, passport) => {
                app.use(passport.initialize());
                app.use(passport.session());

                passport.serializeUser(function(u, done) {
                    done(null, u.id);
                });
                passport.deserializeUser(async function(id, done) {
                    let member = await db.models["member"].findById(id);
                    delete member.password;

                    done(null, member);
                });
                passport.use(new Strategy({
                    passReqToCallback: false,
                    session: true
                }, async function(username, password, done) {
                    let member = await db.models["member"].findOne({
                        where: {
                            username: username
                        }
                    });

                    if (member) {
                        let sha1 = crypto.createHash("sha1");
                        sha1.update(password);
                        password = sha1.digest("hex");
                        if (member.password === password) {
                            delete member.password;
                            return done(null, member);
                        }
                    }

                    return done(null, false, new Error("账号或者密码错误!"));
                }));
            },
            'koa-session2': [{
                key: 'NICKTYUI',
                store: new RedisStore()
            }],
            'koa-cors': [{
                methods: ["PUT", "GET", "POST", "DELETE", "HEAD"],
                origin: "*"
            }]
        },
        custom: {
            'error': (app) => {
                app.use(async(ctx, next) => {
                    try {
                        await next();
                        if (ctx.status === 404) ctx.throw(404);
                    } catch (err) {
                        console.log(err);
                        if (err.isBoom) {
                            ctx.status = err.output.statusCode;
                        } else {
                            ctx.status = err.status || 500;
                        }
                        ctx.body = {
                            msg: err.body || err.message,
                            status: ctx.status,
                            url: ctx.url,
                            name: app.name,
                            stack: app.env === "production" ? "" : err.stack + "\n"
                        };
                    }
                });
            }
        },
        order: [
            'koa-better-error-handler',
            'koa-methodoverride',
            'koa-compress',
            'koa-conditional-get',
            'koa-etag',
            'koa-cors',
            'koa-better-body',
            "koa-session2",
            'koa-passport',
            'error'
        ]
    };
}