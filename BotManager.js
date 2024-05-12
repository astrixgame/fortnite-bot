import { createRequire } from 'module';

import Logger from "./Logger.js";
import Enums from "./Enums.js";

const require = createRequire(import.meta.url);
const { Client } = require("fnbr");

class BotManager {
    constructor(mainInstance) {
        this.mainInstance = mainInstance;
        this.mainInstance.loader.register("botmanager");

        this.logger = new Logger(this.mainInstance, "Bot Manager");
        this.auth = {};
        this.clientOptions = {};
        this.client = null;
        this.running = 0;
        this.chatHistory = [];

        this.logger.log(Enums.INFO, "Registering bot manager");

        //clientOptions.auth.authorizationCode = async () => Client.consoleQuestion('Please enter an authorization code: ');

        

        //client.on('friend:request', (req) => {
        //    req.accept();
        //});
        
        //client.on('party:invite', (inv) => {
            //if (config.inviteaccept) inv.accept();
            //else inv.decline();
            //console.log(`${config.inviteaccept ? 'accepted' : 'declined'} party invite from: ${inv.sender.displayName}`);
        //});
        
        //client.on('party:member:joined', () => {
            //client.party.me.setEmote(defaultCosmetics.emote.id);
        //});
        
        //client.on('friend:message', (m) => handleCommand(m, m.author));
        //client.on('party:member:message', (m) => handleCommand(m, m.author));
    }

    load() {
        if(this.mainInstance.configManager.config.auth.authorizationCode == null) {
            this.auth.deviceAuth = this.mainInstance.configManager.config.auth.deviceAuth;
        } else {
            this.auth.authorizationCode = this.mainInstance.configManager.config.auth.authorizationCode;
        }

        this.clientOptions = {
            status: this.mainInstance.configManager.config.status,
            platform: this.mainInstance.configManager.config.platform,
            cachePresences: false,
            keepAliveInterval: 30,
            auth: this.auth,
            debug: true
        };
        this.logger.log(Enums.INFO, "Registering bot client");
        this.client = new Client(this.clientOptions);

        this.mainInstance.loader.complete("botmanager");

        this.client.on('deviceauth:created', function(da) {
            this.logger.log(Enums.INFO, "New device auth credentials has been accepted");
            this.mainInstance.configManager.config.auth = da;
            this.mainInstance.configManager.config.auth.authorizationCode = null;
            this.mainInstance.configManager.save();
        }.bind(this));

        this.client.on('ready', function() {
            this.logger.log(Enums.INFO, "Bot is online and ready");
            this.updateBotStatus(1);
            this.client.party.me.setOutfit(this.mainInstance.configManager.config.outfit);
            if(this.mainInstance.configManager.config.backpack != null)
                this.client.party.me.setBackpack(this.mainInstance.configManager.config.backpack);
            this.client.party.me.setPickaxe(this.mainInstance.configManager.config.pickaxe);
            this.client.party.me.setLevel(this.mainInstance.configManager.config.level);
            this.client.party.me.setBanner(this.mainInstance.configManager.config.banner, this.mainInstance.configManager.config.bannerColor);
            this.client.party.me.setCosmeticStats(this.mainInstance.configManager.config.crowns);
            this.client.setStatus(this.mainInstance.configManager.config.status.text, this.mainInstance.configManager.config.status.type);
            this.client.party.setPrivacy({public:Enums.PARTY_PUBLIC,private:Enums.PARTY_PRIVATE}[this.mainInstance.configManager.config.privacy]);
            this.mainInstance.configManager.config.botname = this.client.party.me._displayName;
            this.mainInstance.configManager.save();
            this.mainInstance.webConnection.send({ action: "botname", name: this.mainInstance.configManager.config.botname });
            /*this.client.friend.pendingList.forEach(function(e) {
                console.log(e);
                e.accept();
            });*/
        }.bind(this));

        this.client.on('party:invite', (inv) => {
            inv.accept();
        });

        this.client.on('friend:request', (req) => {
            req.accept();
        });

        this.client.on('party:member:message', (m) => {
            var hours = m.sentAt.getHours(), minutes = m.sentAt.getMinutes(), seconds = m.sentAt.getSeconds();
            var time = (hours > 10 ? hours : "0"+hours)+":"+(minutes > 10 ? minutes : "0"+minutes)+":"+(seconds > 10 ? seconds : "0"+seconds);
            this.chatHistory.push({ author: m.author._displayName, time: time, message: m.content });
            this.mainInstance.webConnection.send({ action: "chat", author: m.author._displayName, time: time, message: m.content });
        });

        this.client.on('disconnected', (m) => {
            console.log(m);
        });
    }

    login() {
        if(this.running == 0) {
            this.updateBotStatus(2);
            var loginPromise = this.client.login();
            loginPromise.then(function() {
                this.logger.log(Enums.INFO, "Bot client has been logined");
            }.bind(this));
            return loginPromise;
        } else
            return new Promise((r) => r());
    }

    logout() {
        this.updateBotStatus(2);
        var logoutPromise = this.client.logout();
        logoutPromise.then(function() {
            this.updateBotStatus(0);
        }.bind(this));
        return logoutPromise;
    }

    updateBotStatus(status) {
        this.running = status;
        this.mainInstance.webConnection.send({ action: "turn", state: status });
    }
}

export default BotManager