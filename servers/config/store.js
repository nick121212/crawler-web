import Redis from "ioredis";
import { Store } from "koa-session2";
import redisConfig from './redis';

export class RedisStore extends Store {
    constructor() {
        super();
        this.redis = new Redis({
            port: redisConfig.port,
            host: redisConfig.host,
            family: redisConfig.family,
            password: redisConfig.password,
            db: redisConfig.db
        });
    }

    async get(sid) {
        let data = await this.redis.get(`SESSION:${sid}`);

        return JSON.parse(data);
    }

    async set(session, opts) {
        if (!opts.sid) {
            opts.sid = this.getID(24);
        }
        await this.redis.set(`SESSION:${opts.sid}`, JSON.stringify(session));
        return opts.sid;
    }

    async destroy(sid) {
        return await this.redis.del(`SESSION:${sid}`);
    }
}