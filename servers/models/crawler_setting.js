/**
 * 定义爬虫的配置文件
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|{timestamps, freezeTableName}|Model|void}
 */

import JsonField from 'sequelize-json';

export default (sequelize, DataTypes) => {
    return sequelize.define('crawlerSetting', {
        key: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            unique: true
        },
        host: { type: DataTypes.STRING(30), allowNull: false },
        domainWhiteList: JsonField(sequelize, 'crawlerSetting', 'domainWhiteList'),
        whitePathList: JsonField(sequelize, 'crawlerSetting', 'whitePathList'),
        interval: { type: DataTypes.INTEGER },
        downloader: { type: DataTypes.STRING(10) },
        initDomain: { type: DataTypes.STRING(30) },
        proxySettings: JsonField(sequelize, 'crawlerSetting', 'proxySettings'),
        pages: JsonField(sequelize, 'crawlerSetting', 'pages'),
        description: { type: DataTypes.TEXT, allowNull: true },
    });
};