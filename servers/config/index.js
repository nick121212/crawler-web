import middleware from "./middleware";
import site from "./site";
import { config } from "./configUtils";

export default {
    middleware: middleware(config),
    site: site(config),
    db: require('./db').default(config), //_.extend({}, config.db || {}, require('./db').default),
    es: require('./es').default(config), //_.extend({}, config.es || {}, require('./es').default),
    rabbitmq: require('./rabbitmq').default(config), // _.extend({}, config.rabbitmq || {}, require('./rabbitmq').default),
    redis: require('./redis').default(config) // _.extend({}, config.redis || {}, require('./redis').default)
};