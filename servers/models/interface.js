import JsonField from 'sequelize-json';

/**
 * 定义模块表
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|{timestamps, freezeTableName}|Model|void}
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('interface', {
        key: {
            type: DataTypes.STRING(50),
            unique: true
        },
        group: { type: DataTypes.STRING(10), allowNull: false },
        protocol: { type: DataTypes.STRING(10), allowNull: true },
        method: { type: DataTypes.INTEGER, allowNull: true },
        path: { type: DataTypes.STRING(50), allowNull: true },
        host: { type: DataTypes.STRING(20), allowNull: true },
        port: { type: DataTypes.INTEGER, allowNull: true },
        server: { type: DataTypes.STRING(10), allowNull: true },
        description: { type: DataTypes.STRING(100), allowNull: true },
        jpp: JsonField(sequelize, 'interface', 'jpp'),
        idFieldPath: JsonField(sequelize, 'interface', 'idFieldPath'),
        isRestful: { type: DataTypes.BOOLEAN, defaultValue: false }
    });
};