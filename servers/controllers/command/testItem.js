import boom from 'boom';
import utils from '../';
import rabbitmq from '../../utils/rabbitmq';
import { client } from '../../utils/es';
import uuid from 'node-uuid';
import _ from 'lodash';
import db from '../../utils/db';

export default (sequelizeModel) => {
    /**
     * 创建模块数据
     */
    return async(ctx, next) => {
        let modelIntance = ctx.request.body;

        if (typeof modelIntance !== "object") {
            throw boom.badData('数据没有填写完整!');
        }

        // let command = await db.models.command.findOne({
        //     where: {
        //         key: modelIntance.command
        //     }
        // });

        let command = modelIntance.command;

        if (!command) {
            throw boom.badData("没有找到命令或已删除！");
        }

        let queueItem = {
            cmdid: uuid(),
            cmd: command.cmd,
            listip: _.map(modelIntance.listIps, (service) => {
                return {
                    deviceSn: service._source.deviceSn,
                    ip: service._source.minionid
                }
            }),
            args: command.args || [],
            cmdKey: command.key
        };

        let bodies = [];

        bodies.push({
            index: {
                _index: "cmdb.execute.cmd",
                _type: "salt",
                _id: queueItem.cmdid,
            }
        });
        bodies.push({
            command: command,
            cmdKey: command.key,
            devLen: modelIntance.listIps.length,
            complete: false,
            createdAt: Date.now()
        });

        _.each(modelIntance.listIps, (device) => {
            bodies.push({
                index: {
                    _index: "commdone.logs",
                    _type: "cmd",
                    _id: queueItem.cmdid + "#" + device._source.deviceSn
                }
            });
            bodies.push(_.extend({
                return: "",
                jid: queueItem.cmdid,
                success: null,
                deviceSn: device._source.deviceSn,
                minionid: device._source.minionid,
                hostname: device._source.hostname
            }, {}));
        });

        let esRes = await client.bulk({
            body: bodies
        });
        let result = await rabbitmq.getQueue("cmdb.command", {});
        let res = await result.ch.publish("amq.topic", `salt.commands`, new Buffer(JSON.stringify(queueItem)), {
            persistent: true
        });

        let resultTimeout = await rabbitmq.getQueue("cmdb.execute.timeout", {});
        let resTimeout = await resultTimeout.ch.publish("amq.topic", `cmdb.execute.timeout`, new Buffer(JSON.stringify(queueItem)), {
            persistent: true
        });

        await result.ch.close();
        await resultTimeout.ch.close();

        ctx.body = {
            result: res,
            esRes: esRes,
            queueItem: queueItem,
            jid: queueItem.cmdid
        };
    };
};