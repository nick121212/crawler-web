import boom from 'boom';
import _ from 'lodash';
import utils from '../';

export default (sequelizeModel, uniqueFields = [], idField = "id") => {
    return async(ctx, next) => {
        let key = ctx.params["key"];
        let model = ctx.request.body;

        if (!key) {
            throw boom.badData(`key不能为空!`);
        }

        let modelInstance = await sequelizeModel.findById(key);

        if (!modelInstance) {
            throw boom.badData(`找不到key:${key}的数据或者已删除!`);
        }

        delete model.createdAt;
        delete model.updatedAt;
        delete modelInstance.createdAt;

        modelInstance.updatedAt = new Date();
        utils.removeAttributes(sequelizeModel, modelInstance);

        ctx.body = await modelInstance.updateAttributes(model);
    };
};