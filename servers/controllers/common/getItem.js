import boom from 'boom';
import { sequelize } from '../../utils/db';

export default (sequelizeModel) => {
    return async(ctx, next) => {
        let key = ctx.params["key"];

        if (!key) {
            throw boom.badData(`key不能为空`);
        }

        let model = await sequelizeModel.findById(key);

        if (!model) {
            throw boom.badData(`找不到key:${key}的数据或者已删除!`);
        }

        ctx.body = model;
    };
};