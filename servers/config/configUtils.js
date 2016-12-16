import fs from "fs";
import util from "util";
import { EventEmitter } from "events";
import _ from "lodash";

export class Configurator extends EventEmitter {
    constructor(file, reload) {
        super();

        this.config = {};
        this.oldConfig = {};
        this.automaticConfigReload = reload;
        this.updateConfig(file);
    }

    updateConfig(file) {
        util.log(`[${process.pid}] reading config file: ${file}`);
        let config = JSON.parse(fs.readFileSync(file, "utf8"));

        this.oldConfig = this.config;
        this.config = config;
    }
}

export const configFile = () => {
    if (process.argv.length < 2) {
        console.log("没有定义config文件");
        // process.exit(1);
        return {};
    }
    let config = new Configurator(process.argv[2]);

    return config.config;
};

export const config = configFile();