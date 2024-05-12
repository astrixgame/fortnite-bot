import fs from "fs";

import Logger from "./Logger.js";
import Enums from "./Enums.js";

class Config {
    constructor(mainInstance) {
        this.mainInstance = mainInstance;
        this.mainInstance.loader.register("config");
        this.logger = new Logger(this.mainInstance, "Config Manager");
        this.config = {};

        this.logger.log(Enums.INFO, "Registering config manager");
        this.logger.log(Enums.INFO, "Loading config file");
        
    }

    load() {
        return new Promise(function(resolve) {
            fs.readFile("config.json", { encoding: 'utf-8' }, function(error, data) {
                if(!error) {
                    try {
                        this.config = JSON.parse(data);
                        this.logger.log(Enums.INFO, "Config file has been loaded");
                        this.mainInstance.loader.complete("config");
                        resolve();
                    } catch(e) {
                        this.logger.log(Enums.ERROR, "Cannot parse config data into object");
                    }
                } else
                    this.logger.log(Enums.ERROR, "Cannot load config file, reason: "+error);
            }.bind(this));
        }.bind(this));
    }

    save() {
        return new Promise(function(resolve) {
            fs.writeFile("config.json", JSON.stringify(this.config), { encoding: 'utf-8' }, function(error) {
                if(error)
                    this.logger.log(Enums.ERROR, "Cannot save config file, reason: "+error);
                resolve();
            }.bind(this));
        }.bind(this));
    }
}

export default Config