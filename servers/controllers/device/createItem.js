import fs from 'fs';
import _ from 'lodash';
import boom from 'boom';
import { client } from '../../utils/es';

export default () => {
    return async(ctx, next) => {
        let model = ctx.request.body;
        let results = await client.mget({
            body: {
                docs: [
                    { _index: 'cmdb.device', _type: 'salt', _id: model.deviceSn },
                    { _index: 'cmdb.device', _type: 'manual', _id: model.deviceSn }
                ]
            }
        });

        // 如果在salt里面有，则不能入库，如果manual里面有，则不能入库
        if (results.docs[0].found || results.docs[1].found) {
            throw boom.badData(`【${model.deviceSn}】已经存在!`);
        }

        model.updatedAt = Date.now();
        results = await client.create({
            index: 'cmdb.device',
            type: 'manual',
            id: model.deviceSn,
            body: model
        });

        ctx.body = results;
    };
};