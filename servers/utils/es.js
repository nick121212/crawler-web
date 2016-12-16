import elasticsearch from 'elasticsearch';
import config from '../config';

export const client = new elasticsearch.Client({
    host: `${config.es.host}:${config.es.port}`,
    log: config.es.log
});

// setInterval(() => {
//     client.ping({
//         requestTimeout: Infinity,
//         hello: "elasticsearch!"
//     }).catch((err) => {
//         throw err;
//     });
// }, 10000);