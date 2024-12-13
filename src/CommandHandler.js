import Logger from './Logger.js';
import Enums from './Enums.js';

class CommandHandler {
    constructor(instance, uuid) {
        this.connectionInstance = instance;
        this.mainInstance = this.connectionInstance.mainInstance;
        this.uuid = uuid;
        this.logger = new Logger(this.mainInstance, "Command Handler");
    }

    process(data) {
        if(data.action == null) {
            this.logger.log(Enums.WARNING, "Recieved command have unspecified module");
            return;
        }
        switch(data.action) {
            case "getTurn":
                this.response({ action: data.action, state: this.mainInstance.botManager.running }, true);
            break;
            case "turn":
                if(data.state != null)
                    if(data.state)
                        this.mainInstance.botManager.login();
                    else
                        this.mainInstance.botManager.logout();
                this.response(data);
            break;
            case "setLevel":
                if(data.level != null) {
                    var level = parseInt(data.level, 10);
                    this.mainInstance.botManager.client.party.me.setLevel(level);
                    this.mainInstance.configManager.config.level = level;
                    this.mainInstance.configManager.save();
                    this.response(data);
                }
            break;
            case "setOutfit":
                if(data.id != null) {
                    this.mainInstance.botManager.client.party.me.setOutfit(data.id);
                    this.mainInstance.configManager.config.outfit = data.id;
                    this.mainInstance.configManager.save();
                    this.response(data);
                }
            break;
            case "setBackpack":
                if(data.id != null)
                    this.mainInstance.botManager.client.party.me.setBackpack(data.id);
                else
                    this.mainInstance.botManager.client.party.me.clearBackpack();
                this.mainInstance.configManager.config.backpack = data.id;
                this.mainInstance.configManager.save();
                this.response(data);
            break;
            case "setPickaxe":
                if(data.id) {
                    this.mainInstance.botManager.client.party.me.setPickaxe(data.id);
                    this.mainInstance.configManager.config.pickaxe = data.id;
                    this.mainInstance.configManager.save();
                    this.response(data);
                }
            break;
            case "setBanner":
                if(data.id != null && data.color != null) {
                    this.mainInstance.botManager.client.party.me.setBanner(data.id, data.color);
                    this.mainInstance.configManager.config.banner = data.id;
                    this.mainInstance.configManager.config.bannerColor = data.color;
                    this.mainInstance.configManager.save();
                    this.response(data);
                }
            break;
            case "doEmote":
                if(data.id != null)
                    this.mainInstance.botManager.client.party.me.setEmote(data.id);
                else
                    this.mainInstance.botManager.client.party.me.clearEmote();
                this.response(data);
            break;
            case "doEmoji":
                if(data.id != null) {
                    this.mainInstance.botManager.client.party.me.setEmoji(data.id);
                    this.response(data);
                }
            break;
            case "setCrowns":
                if(data.count != null) {
                    this.mainInstance.botManager.client.party.me.setCosmeticStats(data.count);
                    this.mainInstance.configManager.config.crowns = data.count;
                    this.mainInstance.configManager.save();
                    this.response(data);
                }
            break;
            case "ready":
                if(data.state != null) {
                    this.mainInstance.botManager.client.party.me.setReadiness(data.state);
                    this.response(data);
                }
            break;
            case "sitout":
                if(data.state != null) {
                    this.mainInstance.botManager.client.party.me.setSittingOut(data.state);
                    this.response(data);
                }
            break;
            case "status":
                if(data.status != null)
                    this.mainInstance.configManager.config.status.type = data.status;
                if(data.text != null)
                    this.mainInstance.configManager.config.status.text = data.text;
                this.mainInstance.configManager.save();
                this.mainInstance.botManager.client.setStatus(this.mainInstance.configManager.config.status.text, this.mainInstance.configManager.config.status.type);
                this.response(data);
            break;
            case "send":
                if(data.message != null) {
                    this.mainInstance.botManager.client.party.chat.send(data.message);
                    var dt = new Date();
                    var hours = dt.getHours(), minutes = dt.getMinutes(), seconds = dt.getSeconds();
                    var time = (hours > 10 ? hours : "0"+hours)+":"+(minutes > 10 ? minutes : "0"+minutes)+":"+(seconds > 10 ? seconds : "0"+seconds);
                    this.chatHistory.push({ author: this.mainInstance.botManager.client.user.self._displayName, time: time, message: data.message });
                    this.response({ action: "chat", author: this.mainInstance.botManager.client.user.self._displayName, time: time, message: data.message });
                }
            break;
            case "privacy":
                if(data.state != null) {
                    this.mainInstance.configManager.config.privacy = data.state;
                    this.mainInstance.configManager.save();
                    this.mainInstance.botManager.client.party.setPrivacy({public:Enums.PARTY_PUBLIC,private:Enums.PARTY_PRIVATE}[data.state]);
                    this.response(data);
                }
            break;
            case "loadConsole":
                this.response({ action: data.action, data: this.mainInstance.log }, true);
            break;
            default:
                this.logger.log(Enums.WARNING, "Recieved command action not exist");
            break;
        }
    }

    response(data, currentUUID = false) {
        this.connectionInstance.send(data, currentUUID ? this.uuid : null);
    }
}

export default CommandHandler
