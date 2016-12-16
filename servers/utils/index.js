import _ from 'lodash';

export default {
    query: (query) => {
        let filter = query || {};

        filter = _.extend({
            limit: 10,
            offset: 0
        }, filter);

        if (filter.attributes && _.isArray(filter.attributes)) {
            !filter.attributes.length && delete filter.attributes;
        } else {
            delete filter.attributes;
        }

        filter.limit = ~~filter.limit;
        filter.offset = ~~filter.offset;
        filter.where && typeof filter.where === "string" && (filter.where = JSON.parse(filter.where));
        if (_.isEmpty(filter.where)) {
            delete filter.where;
        }

        if (filter.order) {
            let orders = filter.order.split('-');
            // 返回的order信息是  -key|key,前面带"-"的是倒序
            if (orders.length > 0) {
                switch (orders.length) {
                    case 1:
                        // orders.push("asc");
                        break;
                    case 2:
                        orders = _.reverse(orders);
                        orders[1] = "desc";
                        break;
                }
                filter.order = [orders];
            }
        }

        return filter;
    }
}