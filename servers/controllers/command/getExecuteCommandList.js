import boom from 'boom';
import utils from '../';
import _ from 'lodash';
import { client } from '../../utils/es';

export default (sequelizeModel) => {
    /**
     * 创建模块数据
     */
    return async(ctx, next) => {
        let filter = utils.getEsQuery(ctx.query);

        filter.esQuery.aggs = {
            "count_success": {
                "terms": {
                    "field": "success"
                }
            }
        };
        let results = await client.search({
            index: "cmdb.execute.cmd",
            from: filter.offset,
            size: filter.limit,
            body: filter.esQuery,
            sort: filter.sort,
            timeout: '10s'
        });

        ctx.body = results;
    };
};