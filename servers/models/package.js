import JsonField from 'sequelize-json';

/**
 * 定义模块表
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|{timestamps, freezeTableName}|Model|void}
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('package', {
        key: {
            type: DataTypes.STRING(50),
            unique: true
        },
        commands: JsonField(sequelize, 'package', 'commands'),
        description: { type: DataTypes.TEXT, allowNull: true }
    });
};