/**
 * 定义命令执行模块
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|{timestamps, freezeTableName}|Model|void}
 */

import JsonField from 'sequelize-json';

export default (sequelize, DataTypes) => {
    return sequelize.define('command', {
        key: {
            type: DataTypes.STRING(50),
            unique: true
        },
        title: { type: DataTypes.STRING(50), allowNull: false },
        cmd: { type: DataTypes.STRING(50), allowNull: false },
        args: JsonField(sequelize, 'command', 'args'),
        dataSchemaKey: { type: DataTypes.TEXT, allowNull: true },
        formSchemaKey: { type: DataTypes.TEXT, allowNull: true },
        options: JsonField(sequelize, 'command', 'options'),
        description: { type: DataTypes.TEXT, allowNull: true }
    });
};