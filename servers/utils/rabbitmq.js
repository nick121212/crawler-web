import elasticsearch from 'elasticsearch';
import config from '../config';
import amqplib from 'amqplib';
import _ from 'lodash';

const connectionStr = `amqp://${config.rabbitmq.username}:${config.rabbitmq.password}@${config.rabbitmq.host}`;
const connPromise = amqplib.connect(connectionStr);

let channel = null;
let connection = null;

let getQueue = (qName, qSetting) => {
    let ch = null;

    return connPromise.then(conn => {
        connection = conn;
        return conn.createChannel();
    }).then((c) => {
        channel = ch = c;
        return c.assertQueue(qName, _.extend({
            durable: true,
            exclusive: false,
            autoDelete: false
        }, qSetting));
    }).then(q => {
        return {
            ch: ch,
            q: q
        };
    });
}

export default {
    getQueue: getQueue,
    cancel: (tag) => {
        return channel.cancel(tag);
    }
};