import fs from 'fs';
import _ from 'lodash';
import boom from 'boom';
import { client } from '../../utils/es';

export default () => {
    return async(ctx, next) => {
        let { key, type } = ctx.params;
        let model = ctx.request.body;

        if (!key) {
            throw boom.badData(`key不能为空`);
        }

        let result = await client.get({
            index: 'cmdb.device',
            type: type,
            id: key
        });

        if (!result.found) {
            throw boom.badData(`没有找到编号为【${key}】的设备！`);
        }

        if (result._type === "manual") {
            return ctx.body = await client.update({
                index: 'cmdb.device',
                type: type,
                id: key,
                body: {
                    doc: model._source
                }
            });
        }

        ctx.body = await client.update({
            index: 'cmdb.device',
            type: type,
            id: key,
            body: {
                doc: {
                    hostname: model._source.hostname,
                    project: model._source.project,
                    env: model._source.env,
                    updatedAt: Date.now()
                }
            }
        });
    };
};