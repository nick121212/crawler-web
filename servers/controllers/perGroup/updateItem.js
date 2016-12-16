import boom from 'boom';
import _ from 'lodash';
import utils from '../';
import db from '../../utils/db';

export default (sequelizeModel) => {
    return async(ctx, next) => {
        let key = ctx.params["key"];
        let model = ctx.request.body;
        let actions = model.actions;

        if (!key) {
            throw boom.badData(`key不能为空!`);
        }

        let modelInstance = await sequelizeModel.findById(key);
        let trans = await db.sequelize.transaction();

        if (!modelInstance) {
            throw boom.badData(`找不到key:${key}的数据或者已删除!`);
        }

        delete model.createdAt;
        delete model.updatedAt;
        delete model.actions;
        delete modelInstance.createdAt;

        modelInstance.updatedAt = new Date();
        utils.removeAttributes(sequelizeModel, modelInstance);

        try {
            model.groupActions = [];
            modelInstance = await modelInstance.updateAttributes(model, {
                transaction: trans
            });
            _.each(actions, (action) => {
                _.each(action.actions, (action) => {
                    if (action.perGroupActions.length && action.perGroupActions[0].key === action.key) {
                        model.groupActions.push({
                            actionId: action.id,
                            perGroupId: modelInstance.id
                        });
                    }
                });
            });
            await db.sequelize.query(`delete from ${db.models.pergroupaction.name} where perGroupId=$1`, {
                transaction: trans,
                bind: [modelInstance.id]
            });
            await db.models.pergroupaction.bulkCreate(model.groupActions, {
                transaction: trans
            });
            await trans.commit();
        } catch (e) {
            await trans.rollback();
            throw e;
        }

        ctx.body = {};
    };
};