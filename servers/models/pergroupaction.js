import JsonField from 'sequelize-json';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('perGroupAction', {
        // actionKey: DataTypes.STRING(50)
    }, {
        createdAt: false,
        updatedAt: false,
        relations: [
            { type: 'belongsTo', target: 'perGroup' },
            { type: 'belongsTo', target: 'action' }
        ]
    });
};