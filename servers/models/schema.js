/**
 * 定义SCHEMA列表
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|{timestamps, freezeTableName}|Model|void}
 */

import JsonField from 'sequelize-json';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('schema', {
        key: {
            type: DataTypes.STRING(50),
            unique: true
        },
        type: {
            type: DataTypes.STRING(10)
        },
        group: {
            type: DataTypes.STRING(20)
        },
        text: JsonField(sequelize, 'schema', 'text'),
        textForm: JsonField(sequelize, 'schema', 'textForm'),
        description: { type: DataTypes.TEXT },
    });
};