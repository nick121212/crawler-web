import boom from 'boom';
import db from '../../utils/db';
import utils from '../';
import _ from 'lodash';

export default (sequelizeModel) => {
    /**
     * 创建模块数据
     */
    return async(ctx, next) => {
        let modelIntance = ctx.request.body;
        let actions = modelIntance.actions;
        let trans = await db.sequelize.transaction();

        if (typeof modelIntance !== "object") {
            throw boom.badData('数据没有填写完整!');
        }

        utils.checkUniqueFields(sequelizeModel, modelIntance);
        utils.removeAttributes();


        delete modelIntance.actions;
        modelIntance.createdAt = Date.now();
        modelIntance.groupActions = [];

        try {
            let perGroup = await sequelizeModel.create(modelIntance, {
                transaction: trans
            });

            _.each(actions, (action) => {
                _.each(action.actions, (action) => {
                    if (action.perGroupActions.length && action.perGroupActions[0].key === action.key) {
                        modelIntance.groupActions.push({
                            actionId: action.id,
                            perGroupId: perGroup.id
                        });
                    }
                });
            });

            await db.models.pergroupaction.bulkCreate(modelIntance.groupActions, {
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