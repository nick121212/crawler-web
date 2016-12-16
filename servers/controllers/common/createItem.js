import boom from 'boom';
import db from '../../utils/db';
import utils from '../';

export default (sequelizeModel) => {
    /**
     * 创建模块数据
     */
    return async(ctx, next) => {
        let modelIntance = ctx.request.body;

        if (typeof modelIntance !== "object") {
            throw boom.badData('数据没有填写完整!');
        }

        utils.checkUniqueFields(sequelizeModel, modelIntance);
        utils.removeAttributes();

        modelIntance.createdAt = Date.now();

        ctx.body = await sequelizeModel.create(modelIntance);
    };
};