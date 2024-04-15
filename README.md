# Fortnite Bot
This bot is developed to get bot lobby in fortnite using basic libraries and providing web control panel and much more.
    

## 🧐 Features    
- Set season level
- Set crowns count
- Set cosmetics & emotes
- Messaging ingame over web
## 🛠️ Tech Stack
- [fnbr.js](https://fnbr.js.org)
- [Node.js](https://nodejs.org)
- HTML
- JavaScript
- CSS

## 🛠️ Run instructions
```bash
npm install ws
```
Run server
```bash
node .
```
You can use Apache or NGINX or built in windows IIS web server to get working web contorl panel
<center><br><i>In future the web server will be built in feature in the server. But not yet.</i></center>

## 🧑🏻‍💻 Custom usage
```js
import FortniteBotServer from "./libs/FortniteBotServer.js";

var server = new FortniteBotServer();
```
This library will automatically find ```config.json``` and use provided settings & auth codes in it.

You should get your auth token in [Here](https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code) and copy the ```authorizationCode``` value and paste it into the config file to the ```authorizationCode``` field (replace ```null```)

```js
{
    "botname": "",
    "outfit": "CID_090_Athena_Commando_M_Tactical",
    "backpack": "BID_004_BlackKnight",
    "emote": "EID_JustHome",
    "pickaxe": "Pickaxe_ID_013_Teslacoil","banner":"BRS14_Clover","bannerColor":"default","crowns":238,"level":496,
    "privacy": "private",
    "status": {
        "text": "Hello everyone!",
        "type": "online"
    },
    "platform": "WIN",
    "auth": {
        "deviceAuth": {
            "accountId": "",
            "deviceId": "",
            "secret": ""
        },
        "authorizationCode": null
    }
}
```
        
## ❤️ Support  
A simple star to this project repo is enough to keep me motivated on this project for days. If you find your self very much excited with this project let me know with a tweet.
        
## 🙇 Author
#### AstrixGame
- Twitter: [@astrixgame](https://twitter.com/@AstrixGame)
- Github: [@astrixgame](https://github.com/astrixgame)
        
## ➤ License
Distributed under the Apache-2.0 license. See [LICENSE](LICENSE) for more information.
        
