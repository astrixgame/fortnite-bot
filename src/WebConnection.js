import { WebSocketServer } from 'ws';

import Enums from './Enums.js';
import Logger from './Logger.js';
import GenerateUUID from './GenerateUUID.js';
import CommandHandler from './CommandHandler.js';

class WebConnection {
    constructor(mainInstance) {
        this.mainInstance = mainInstance;
        this.mainInstance.loader.register("webconnection");
        this.logger = new Logger(this.mainInstance, "Web Connection");
        this.server = null;
        this.clients = {};

        this.logger.log(Enums.INFO, "Loading web connection settings");
        this.port = mainInstance.config.webSocketPort;

        this.logger.log(Enums.INFO, "Creating websocket server");
        try {
            this.server = new WebSocketServer({ port: this.port }, function() {
                this.logger.log(Enums.INFO, "WebSocket server has been started");
                this.mainInstance.loader.complete("webconnection");
            }.bind(this));
            this.logger.log(Enums.INFO, "Starting websocket server");

            this.logger.log(Enums.INFO, "Registering listeners for websocket server");
            this.server.on('connection', (c) => this.connectionOpenHandler(c));
        } catch(e) {
            this.logger.log(Enums.ERROR, "Can't create websocket server, reason: "+e);
        }
    }

    connectionOpenHandler(client) {
        var clientUUID = GenerateUUID.gen(16);
        var commandProcessor = new CommandHandler(this, clientUUID);

        this.clients[clientUUID] = {
            conn: client,
            dataProcessor: commandProcessor
        };

        this.send([
            { action: "botname", name: this.mainInstance.configManager.config.botname },
            { action: "turn", state: this.mainInstance.botManager.running },
            { action: "status", status: this.mainInstance.configManager.config.status.type, text: this.mainInstance.configManager.config.status.text },
            { action: "privacy", state: this.mainInstance.configManager.config.privacy },
            { action: "chatHistory", messages: this.mainInstance.botManager.chatHistory },
            { action: "setCrowns", count: this.mainInstance.configManager.config.crowns },
            { action: "setLevel", level: this.mainInstance.configManager.config.level }
        ], clientUUID);

        client.on('message', function(data) {
            try {
                data = JSON.parse(data);
            } catch(e) {
                this.logger.log(Enums.WARNING, "Input message is not valid object, specified: "+e);
                return;
            }
            commandProcessor.process(data);
        }.bind(this));

        client.on('close', () => this.connectionCloseHandler(clientUUID));
    }

    connectionCloseHandler(uuid) {
        delete this.clients[uuid];
    }

    send(data, uuid = null) {
        try {
            data = JSON.stringify(data);
        } catch(e) {
            this.logger.log(Enums.WARNING, "Cannot convert ServerSendMessage from object to string");
            return;
        }
        if(uuid == null)
            Object.values(this.clients).forEach((c) => c.conn.send(data));
        else
            if(typeof this.clients[uuid].conn != "undefined")
                this.clients[uuid].conn.send(data);
    }
}

export default WebConnection
