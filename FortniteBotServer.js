import Logger from './Logger.js';
import Loader from './Loader.js';
import Enums from './Enums.js';
import WebConnection from './WebConnection.js';
import Config from './Config.js';
import BotManager from './BotManager.js';

class FortniteBotServer {
    constructor(options = {}) {
        this.loader = new Loader(this);
        this.loader.register("main");

        this.config = {
            webSocketPort: options.webSocketPort || 35756
        };
        this.log = [];
        this.running = true;

        this.loader.on("loaded", function(time) {
            this.logger.log(Enums.INFO, "FortniteBotServer fully started in "+time+"ms");
            
        }.bind(this));

        this.logger = new Logger(this, "Main Thread");
        this.logger.log(Enums.INFO, "Starting FortniteBotServer");

        this.logger.log(Enums.INFO, "Registering web connection server");
        this.webConnection = new WebConnection(this);

        this.logger.log(Enums.INFO, "Creating bot manager object");
        this.botManager = new BotManager(this);

        this.logger.log(Enums.INFO, "Creating config manager object");
        this.configManager = new Config(this);
        this.configManager.load().then(function() {
            this.botManager.load();
        }.bind(this));

        this.loader.complete("main");
    }
}

export default FortniteBotServer