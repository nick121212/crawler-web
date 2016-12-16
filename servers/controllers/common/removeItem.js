import boom from 'boom';
import db from '../../utils/db';

export default (sequelizeModel, idField = "id") => {
    return async(ctx, next) => {
        let key = ctx.params["key"];

        if (!key) {
            throw boom.badData(`key不能为空`);
        }

        let modelInstance = await sequelizeModel.findById(key);
        if (!modelInstance) {
            throw boom.badData(`找不到key:${key}的数据或者已删除!`);
        }

        ctx.body = await modelInstance.destroy();
    };
};